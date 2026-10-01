import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { useOnAppActive } from '@/hooks/useAppState';
import { useNotificationStore } from '@/stores/notification-store';

import { consumePendingDeepLink, openDeepLink, setNavigatorReady } from './deep-link';
import { deepLinkFromNotification, requestPushPermission } from './push';

const handledResponses = new Set<string>();

function handleResponse(response: Notifications.NotificationResponse) {
  const id = response.notification.request.identifier;
  if (handledResponses.has(id)) return;
  handledResponses.add(id);
  const link = deepLinkFromNotification(response.notification);
  if (link) openDeepLink(link);
  void useNotificationStore.getState().refresh();
}

/**
 * Port of ContentView.task + AppDelegate notification callbacks. Mounted in the (app) layout,
 * so it only runs while authenticated.
 */
export function usePushNotifications() {
  useEffect(() => {
    let cancelled = false;

    const received = Notifications.addNotificationReceivedListener((notification) => {
      const link = deepLinkFromNotification(notification);
      const { title, body } = notification.request.content;
      if (link) {
        useNotificationStore.getState().injectForeground({
          title: title ?? '',
          body: body ?? '',
          kind: link.type,
          targetId: link.id,
        });
      } else {
        void useNotificationStore.getState().refresh();
      }
    });

    const tapped = Notifications.addNotificationResponseReceivedListener(handleResponse);

    // Wait a frame so the tab navigator has mounted before navigating.
    const frame = requestAnimationFrame(() => {
      setNavigatorReady(true);
      consumePendingDeepLink();
    });

    (async () => {
      await requestPushPermission();
      if (cancelled) return;
      await useNotificationStore.getState().refresh();
      if (cancelled) return;
      // Cold start: the app was launched by tapping a notification.
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last && !cancelled) handleResponse(last);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      setNavigatorReady(false);
      received.remove();
      tapped.remove();
    };
  }, []);

  useOnAppActive(() => {
    void useNotificationStore.getState().refresh();
  });
}
