import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { ApiError } from '@/lib/api/errors';

/** Don't retry auth failures or 4xx responses; retry network/5xx errors up to twice. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError) {
    if (error.kind === 'unauthorized' || error.kind === 'decodingFailed') return false;
    if (error.status !== undefined && error.status < 500) return false;
  }
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: shouldRetry,
    },
  },
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') focusManager.setFocused(status === 'active');
}

let subscribed = false;

/** Refetch stale queries when the app returns to the foreground. Call once at startup. */
export function subscribeAppFocus() {
  if (subscribed) return;
  subscribed = true;
  AppState.addEventListener('change', onAppStateChange);
}
