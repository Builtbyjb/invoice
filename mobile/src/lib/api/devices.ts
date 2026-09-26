import { Platform } from 'react-native';

/** Uploads the push device token to the backend. */
export async function registerDevice(token: string): Promise<void> {
  // TODO: replace with POST /api/v1/devices { token, platform: Platform.OS }
  // return apiRequest({ path: '/api/v1/devices', method: 'POST', body: { token, platform: Platform.OS },
  //   schema: messageResponseSchema, requiresAuth: true });
  if (__DEV__) console.log(`APNs device token (${Platform.OS}): ${token}`);
}
