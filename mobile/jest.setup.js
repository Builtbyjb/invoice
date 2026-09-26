/* eslint-env jest */
jest.mock('expo-secure-store', () => require('./src/test-utils/secure-store-mock').createSecureStoreMock());
jest.mock('expo-notifications', () => ({
  setBadgeCountAsync: jest.fn(async () => true),
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true, status: 'granted' })),
  getDevicePushTokenAsync: jest.fn(async () => ({ type: 'ios', data: 'device-token' })),
  getLastNotificationResponseAsync: jest.fn(async () => null),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));
jest.mock('expo-crypto', () => ({ randomUUID: () => require('crypto').randomUUID() }));
