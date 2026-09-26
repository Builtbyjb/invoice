import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';
import { create } from 'zustand';

import { listNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/api/notifications';
import type { AppNotification, NotificationKind } from '@/schemas/notification';

type ForegroundNotification = {
  title: string;
  body: string;
  kind: NotificationKind;
  targetId?: string | null;
};

type NotificationStore = {
  notifications: AppNotification[];
  refresh(): Promise<void>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
  /** Call when a remote notification arrives in the foreground to surface it immediately. */
  injectForeground(n: ForegroundNotification): void;
  reset(): void;
};

export const selectUnreadCount = (s: Pick<NotificationStore, 'notifications'>) =>
  s.notifications.filter((n) => !n.isRead).length;

export const selectHasUnread = (s: Pick<NotificationStore, 'notifications'>) => s.notifications.some((n) => !n.isRead);

const logError = (what: string, e: unknown) => {
  if (process.env.NODE_ENV !== 'test') console.warn(`${what}: ${e instanceof Error ? e.message : String(e)}`);
};

async function setBadge(count: number) {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (e) {
    logError('Failed to update app badge', e);
  }
}

/** Port of NotificationStore.swift. */
export const useNotificationStore = create<NotificationStore>()((set, get) => {
  const updateBadge = () => setBadge(selectUnreadCount(get()));

  return {
    notifications: [],

    async refresh() {
      try {
        set({ notifications: await listNotifications() });
        await updateBadge();
      } catch (e) {
        logError('Failed to refresh notifications', e);
      }
    },

    async markRead(id) {
      const target = get().notifications.find((n) => n.id === id);
      if (!target || target.isRead) return;
      set({ notifications: get().notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)) });
      try {
        await markNotificationRead(id);
        await updateBadge();
      } catch (e) {
        logError('Failed to mark notification read', e);
      }
    },

    async markAllRead() {
      set({ notifications: get().notifications.map((n) => (n.isRead ? n : { ...n, isRead: true })) });
      try {
        await markAllNotificationsRead();
        await updateBadge();
      } catch (e) {
        logError('Failed to mark all notifications read', e);
      }
    },

    injectForeground({ title, body, kind, targetId }) {
      const notification: AppNotification = {
        id: Crypto.randomUUID(),
        title,
        body,
        kind,
        targetId: targetId ?? null,
        isRead: false,
        createdAt: new Date(),
      };
      set({ notifications: [notification, ...get().notifications] });
      void updateBadge();
    },

    reset() {
      set({ notifications: [] });
      void setBadge(0);
    },
  };
});
