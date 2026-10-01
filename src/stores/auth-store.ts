import { create } from 'zustand';

import { refresh } from '@/lib/api/auth';
import { setUnauthorizedHandler } from '@/lib/api/client';
import { isExpired } from '@/lib/auth/jwt';
import { tokenStore } from '@/lib/auth/token-store';
import { queryClient } from '@/lib/query/query-client';
import type { Token } from '@/schemas/auth';

import { useCoordinatorStore } from './coordinator-store';
import { useNotificationStore } from './notification-store';

export type AuthState = 'undefined' | 'authenticated' | 'notAuthenticated';

export type PendingOtp = { email: string; tempToken: string };

type AuthStore = {
  state: AuthState;
  /** Temporary token from sign in / sign up. Kept in memory only (rewrite plan §6 #1). */
  pendingOtp: PendingOtp | null;
  initialize(): Promise<void>;
  beginOtp(email: string, tempToken: string): void;
  cancelOtp(): void;
  completeOtp(token: Token): Promise<void>;
  handleUnauthorized(): void;
  signOut(): void;
};

const warn = (msg: string, e: unknown) => {
  if (process.env.NODE_ENV !== 'test') console.warn(`${msg}: ${e instanceof Error ? e.message : String(e)}`);
};

/** Port of AuthSession.swift. */
export const useAuthStore = create<AuthStore>()((set, get) => ({
  state: 'undefined',
  pendingOtp: null,

  async initialize() {
    try {
      const token = await tokenStore.read();
      if (!token) {
        set({ state: 'notAuthenticated' });
        return;
      }
      if (!isExpired(token)) {
        set({ state: 'authenticated' });
        return;
      }
      try {
        const next = await refresh(token.refreshToken);
        await tokenStore.save(next);
        set({ state: 'authenticated' });
      } catch (e) {
        warn('AuthSession refresh failed', e);
        get().handleUnauthorized();
      }
    } catch (e) {
      warn('AuthSession initialization error', e);
      get().handleUnauthorized();
    }
  },

  beginOtp(email, tempToken) {
    set({ pendingOtp: { email, tempToken } });
  },

  cancelOtp() {
    set({ pendingOtp: null });
  },

  async completeOtp(token) {
    await tokenStore.save(token);
    set({ state: 'authenticated', pendingOtp: null });
  },

  handleUnauthorized() {
    tokenStore.delete().catch(() => {});
    queryClient.clear();
    useNotificationStore.getState().reset();
    useCoordinatorStore.setState({ pendingInvoiceSearchToken: null });
    set({ state: 'notAuthenticated', pendingOtp: null });
  },

  signOut() {
    get().handleUnauthorized();
  },
}));

setUnauthorizedHandler(() => {
  // Ignore stray 401s after we've already signed out (e.g. in-flight requests).
  if (useAuthStore.getState().state === 'notAuthenticated') {
    tokenStore.delete().catch(() => {});
    return;
  }
  useAuthStore.getState().handleUnauthorized();
});
