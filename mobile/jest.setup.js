/* eslint-env jest */
jest.mock('expo-secure-store', () => require('./src/test-utils/secure-store-mock').createSecureStoreMock());
