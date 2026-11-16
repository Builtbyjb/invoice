/** In-memory replacement for expo-secure-store, used via jest.mock('expo-secure-store', ...). */
export function createSecureStoreMock() {
  const store = new Map<string, string>();
  const keyOf = (key: string, opts?: { keychainService?: string }) => `${opts?.keychainService ?? ''}:${key}`;
  return {
    store,
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 1,
    getItemAsync: jest.fn(async (key: string, opts?: { keychainService?: string }) => store.get(keyOf(key, opts)) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string, opts?: { keychainService?: string }) => {
      store.set(keyOf(key, opts), value);
    }),
    deleteItemAsync: jest.fn(async (key: string, opts?: { keychainService?: string }) => {
      store.delete(keyOf(key, opts));
    }),
  };
}
