import type { z } from "zod";

import { tokenStore } from "../auth/token-store";
import { API_BASE_URL } from "../env";
import { tokenSchema, type Token } from "../../schemas/auth";
import { apiErrorSchema } from "../../schemas/common";

import { ApiError, statusText } from "./errors";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions<S extends z.ZodType> = {
    path: string;
    method: HttpMethod;
    /** Zod schema of the successful response body. */
    schema: S;
    /** Undefined values are omitted. */
    query?: Record<string, string | undefined>;
    body?: unknown;
    requiresAuth?: boolean;
    /** Explicit bearer token (verify-otp uses the temporary token). */
    authToken?: string;
    /** Don't try refresh + retry on 401. */
    skipRefresh?: boolean;
    signal?: AbortSignal;
};

let onUnauthorized: () => void = () => {};

/** Registered by the auth store at startup (avoids a circular import). */
export const setUnauthorizedHandler = (fn: () => void) => {
    onUnauthorized = fn;
};

const log = (...args: unknown[]) => {
    if (__DEV__ && process.env.NODE_ENV !== "test") console.log("[api]", ...args);
};

// Built by hand: React Native's URL/URLSearchParams polyfills are incomplete.
export function buildUrl(
    path: string,
    query?: Record<string, string | undefined>,
    base = API_BASE_URL,
): string {
    if (!/^https?:\/\/[^/\s]+/i.test(base) || !path.startsWith("/")) throw ApiError.invalidUrl();
    let url = base.replace(/\/+$/, "") + path;
    if (query) {
        const qs = Object.entries(query)
            .filter((entry): entry is [string, string] => entry[1] !== undefined)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
        if (qs) url += `?${qs}`;
    }
    return url;
}

function isAbortError(e: unknown): boolean {
    return e instanceof Error && e.name === "AbortError";
}

async function send(opts: RequestOptions<z.ZodType>, bearer?: string): Promise<Response> {
    const url = buildUrl(opts.path, opts.query);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (bearer) headers.Authorization = `Bearer ${bearer}`;

    let body: string | undefined;
    if (opts.body !== undefined) {
        try {
            body = JSON.stringify(opts.body);
        } catch {
            throw ApiError.encodingFailed();
        }
    }

    log(opts.method, url);
    try {
        return await fetch(url, { method: opts.method, headers, body, signal: opts.signal });
    } catch (e) {
        if (isAbortError(e)) throw e;
        throw ApiError.network(e instanceof Error ? e.message : String(e));
    }
}

async function readJson(res: Response): Promise<unknown> {
    const text = await res.text();
    if (text.trim() === "") return {};
    return JSON.parse(text);
}

async function decode<S extends z.ZodType>(res: Response, schema: S): Promise<z.output<S>> {
    if (res.status >= 200 && res.status < 300) {
        let json: unknown;
        try {
            json = await readJson(res);
        } catch (e) {
            if (isAbortError(e)) throw e;
            throw ApiError.decodingFailed();
        }
        const parsed = schema.safeParse(json);
        if (!parsed.success) {
            log("decode failed", res.url, parsed.error.issues);
            throw ApiError.decodingFailed();
        }
        return parsed.data;
    }

    let message: string | undefined;
    try {
        const parsed = apiErrorSchema.safeParse(await readJson(res));
        if (parsed.success) message = parsed.data.message;
    } catch {
        // fall back to status text
    }
    throw ApiError.server(res.status, message ?? statusText(res.status, res.statusText));
}

/** Raw request without auth handling. */
export async function rawRequest<S extends z.ZodType>(
    opts: RequestOptions<S>,
    bearer?: string,
): Promise<z.output<S>> {
    const res = await send(opts, bearer);
    return decode(res, opts.schema);
}

// Single-flight refresh (port of actor TokenRefresher).
let refreshing: Promise<Token> | null = null;

export function refreshTokens(): Promise<Token> {
    refreshing ??= (async () => {
        try {
            const current = await tokenStore.read();
            if (!current?.refreshToken) throw ApiError.unauthorized();
            const next = await rawRequest({
                path: "/api/v1/auth/refresh-token",
                method: "POST",
                body: { refreshTokenId: current.refreshToken },
                schema: tokenSchema,
            });
            await tokenStore.save(next);
            return next;
        } finally {
            refreshing = null;
        }
    })();
    return refreshing;
}

/** Port of APIClient.request: bearer auth, one refresh + retry on 401, forced sign-out on failure. */
export async function apiRequest<S extends z.ZodType>(
    opts: RequestOptions<S>,
): Promise<z.output<S>> {
    let bearer = opts.authToken;
    if (opts.requiresAuth && !bearer) {
        const token = await tokenStore.read();
        if (!token) {
            onUnauthorized();
            throw ApiError.unauthorized();
        }
        bearer = token.accessToken;
    }

    const res = await send(opts, bearer);

    if (res.status === 401 && opts.requiresAuth && !opts.skipRefresh) {
        let next: Token;
        try {
            next = await refreshTokens();
        } catch (e) {
            // The refresh token was rejected (401 or other 4xx): the session is over.
            // Network/5xx errors propagate so a flaky connection doesn't sign the user out.
            const rejected =
                e instanceof ApiError &&
                (e.kind === "unauthorized" ||
                    (e.kind === "server" && (e.status ?? 0) >= 400 && (e.status ?? 0) < 500));
            if (rejected) {
                onUnauthorized();
                throw ApiError.unauthorized();
            }
            throw e;
        }
        const retry = await send(opts, next.accessToken);
        if (retry.status === 401) {
            onUnauthorized();
            throw ApiError.unauthorized();
        }
        return decode(retry, opts.schema);
    }

    return decode(res, opts.schema);
}
