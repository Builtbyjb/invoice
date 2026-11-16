import type { Token } from "../schemas/auth";

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");

/** Port of the Swift test helper `makeToken(payload:)`. */
export function makeToken(payload: Record<string, unknown>, refreshToken = "refresh-token"): Token {
    const header = b64(JSON.stringify({ alg: "none" }));
    const body = b64(JSON.stringify(payload));
    return { accessToken: `${header}.${body}.signature`, refreshToken };
}
