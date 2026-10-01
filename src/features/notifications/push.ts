import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { registerDevice } from '@/lib/api/devices';
import type { DeepLink } from '@/stores/coordinator-store';

/** Requests alert/sound/badge permission and, if granted, registers the raw APNs token with the backend. */
export async function requestPushPermission(): Promise<void> {
  if (!Device.isDevice) return; // Remote push isn't available on simulators.
  try {
    const { granted } = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowSound: true, allowBadge: true },
    });
    if (!granted) return;
    const token = await Notifications.getDevicePushTokenAsync();
    await registerDevice(String(token.data));
  } catch (e) {
    if (__DEV__) console.warn(`Push authorization request failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/** Parses the payload custom keys (`type`, `target_id`) into a DeepLink (port of PushNotificationManager.parse). */
export function parsePushData(data: Record<string, unknown> | null | undefined): DeepLink | null {
  if (!data) return null;
  const type = data.type;
  const targetId = data.target_id;
  if (typeof targetId !== 'string' || targetId === '') return null;
  if (type === 'client' || type === 'invoice') return { type, id: targetId };
  return null;
}

/**
 * The custom APNs keys may live in `content.data` or in the raw APNs `trigger.payload`,
 * depending on how the push was sent. Read `content.data` first.
 */
export function deepLinkFromNotification(notification: Notifications.Notification): DeepLink | null {
  const fromContent = parsePushData(notification.request.content.data as Record<string, unknown> | undefined);
  if (fromContent) return fromContent;
  const trigger = notification.request.trigger as { payload?: Record<string, unknown> } | null;
  return parsePushData(trigger?.payload);
}
