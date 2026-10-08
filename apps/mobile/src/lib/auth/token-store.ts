import * as SecureStore from "expo-secure-store";

import { tokenSchema, type Token } from "../../schemas/auth";

import { preferredCurrency } from "./jwt";

const KEY = "tokens";
const OPTS: SecureStore.SecureStoreOptions = {
    keychainService: "com.acorp.invoice",
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

// undefined = not loaded yet; null = no token stored.
let cached: Token | null | undefined;

function parse(raw: string | null): Token | null {
    if (!raw) return null;
    try {
        const parsed = tokenSchema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

/** Port of TokenStore (Keychain). Keeps an in-memory cache so requests don't hit the Keychain each time. */
export const tokenStore = {
    async read(): Promise<Token | null> {
        if (cached !== undefined) return cached;
        cached = parse(await SecureStore.getItemAsync(KEY, OPTS));
        return cached;
    },

    async save(token: Token): Promise<void> {
        await SecureStore.setItemAsync(KEY, JSON.stringify(token), OPTS);
        cached = token;
    },

    async delete(): Promise<void> {
        cached = null;
        await SecureStore.deleteItemAsync(KEY, OPTS);
    },

    async preferredCurrency(): Promise<string | undefined> {
        const token = await this.read();
        return token ? preferredCurrency(token) : undefined;
    },

    /** Test helper: forget the in-memory cache so the next read hits secure storage. */
    resetCache(): void {
        cached = undefined;
    },
};
