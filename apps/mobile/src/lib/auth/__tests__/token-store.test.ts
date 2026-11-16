import * as RealSecureStore from "expo-secure-store";

import { makeToken } from "../../../test-utils/jwt";
import type { createSecureStoreMock } from "../../../test-utils/secure-store-mock";

import { tokenStore } from "../token-store";

// expo-secure-store is replaced by an in-memory mock in jest.setup.js.
const SecureStore = RealSecureStore as unknown as ReturnType<typeof createSecureStoreMock>;

beforeEach(async () => {
    await tokenStore.delete();
    tokenStore.resetCache();
});

describe("tokenStore (ported from tokenStoreOperations)", () => {
    it("round trips, overwrites and deletes", async () => {
        const token = makeToken({ preferredCurrency: "EUR" });
        await tokenStore.save(token);
        tokenStore.resetCache();
        const read = await tokenStore.read();
        expect(read?.accessToken).toBe(token.accessToken);
        expect(read?.refreshToken).toBe(token.refreshToken);
        expect(await tokenStore.preferredCurrency()).toBe("EUR");

        const second = makeToken({ preferredCurrency: "USD" });
        await tokenStore.save(second);
        tokenStore.resetCache();
        expect((await tokenStore.read())?.accessToken).toBe(second.accessToken);
        expect(await tokenStore.preferredCurrency()).toBe("USD");

        await tokenStore.delete();
        expect(await tokenStore.read()).toBeNull();
        tokenStore.resetCache();
        expect(await tokenStore.read()).toBeNull();
    });

    it("stores tokens with the Swift keychain options", async () => {
        await tokenStore.save(makeToken({}));
        expect(SecureStore.setItemAsync).toHaveBeenLastCalledWith("tokens", expect.any(String), {
            keychainService: "com.acorp.invoice",
            keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
        });
    });

    it("caches reads in memory", async () => {
        await tokenStore.save(makeToken({}));
        SecureStore.getItemAsync.mockClear();
        await tokenStore.read();
        await tokenStore.read();
        expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
    });

    it("returns null for corrupted data", async () => {
        SecureStore.store.set("com.acorp.invoice:tokens", "{not json");
        tokenStore.resetCache();
        expect(await tokenStore.read()).toBeNull();
        SecureStore.store.set("com.acorp.invoice:tokens", '{"accessToken":1}');
        tokenStore.resetCache();
        expect(await tokenStore.read()).toBeNull();
    });
});
