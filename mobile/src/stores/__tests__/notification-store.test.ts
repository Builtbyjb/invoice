import * as Notifications from 'expo-notifications';

import { useNotificationStore, selectHasUnread, selectUnreadCount } from '../notification-store';

const setBadge = Notifications.setBadgeCountAsync as jest.Mock;
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(async () => {
  useNotificationStore.getState().reset();
  setBadge.mockClear();
  await useNotificationStore.getState().refresh();
});

describe('notification store', () => {
  it('loads the mock notifications with 2 unread and sets the badge', () => {
    const state = useNotificationStore.getState();
    expect(state.notifications.map((n) => n.id)).toEqual(['notif-1', 'notif-2', 'notif-3']);
    expect(selectUnreadCount(state)).toBe(2);
    expect(selectHasUnread(state)).toBe(true);
    expect(setBadge).toHaveBeenLastCalledWith(2);
  });

  it('markRead marks one notification and updates the badge', async () => {
    await useNotificationStore.getState().markRead('notif-1');
    expect(selectUnreadCount(useNotificationStore.getState())).toBe(1);
    expect(setBadge).toHaveBeenLastCalledWith(1);
  });

  it('markRead ignores already-read or unknown notifications', async () => {
    setBadge.mockClear();
    await useNotificationStore.getState().markRead('notif-3');
    await useNotificationStore.getState().markRead('nope');
    expect(setBadge).not.toHaveBeenCalled();
  });

  it('markAllRead clears the unread state and badge', async () => {
    await useNotificationStore.getState().markAllRead();
    expect(selectHasUnread(useNotificationStore.getState())).toBe(false);
    expect(setBadge).toHaveBeenLastCalledWith(0);
  });

  it('injectForeground prepends an unread notification', async () => {
    useNotificationStore.getState().injectForeground({ title: 'Paid', body: 'INV-2', kind: 'invoice', targetId: 'i2' });
    await flush();
    const [first] = useNotificationStore.getState().notifications;
    expect(first).toMatchObject({ title: 'Paid', body: 'INV-2', kind: 'invoice', targetId: 'i2', isRead: false });
    expect(first.id).toMatch(/[0-9a-f-]{36}/i);
    expect(selectUnreadCount(useNotificationStore.getState())).toBe(3);
    expect(setBadge).toHaveBeenLastCalledWith(3);
  });

  it('refresh returns fresh copies of the mock data', async () => {
    await useNotificationStore.getState().markAllRead();
    await useNotificationStore.getState().refresh();
    expect(selectUnreadCount(useNotificationStore.getState())).toBe(2);
  });
});
