import { makeToken } from "../../../test-utils/jwt";

import { decodeJwtPayload, isExpired, preferredCurrency } from "../jwt";

const nowSeconds = () => Date.now() / 1000;

describe("JWT claims (ported from invoiceTests.swift)", () => {
    it("preferredCurrencyFromToken", () => {
        expect(preferredCurrency(makeToken({ preferredCurrency: "NGN" }))).toBe("NGN");
    });

    it("tokenIsExpired", () => {
        expect(isExpired(makeToken({ exp: nowSeconds() - 100 }))).toBe(true);
    });

    it("tokenIsNotExpired", () => {
        expect(isExpired(makeToken({ exp: nowSeconds() + 100 }))).toBe(false);
    });

    it("tokenWithinLeewayIsTreatedAsExpired", () => {
        expect(isExpired(makeToken({ exp: nowSeconds() + 10 }))).toBe(true);
    });

    it("missingExpirationIsNotExpired", () => {
        expect(isExpired(makeToken({ preferredCurrency: "USD" }))).toBe(false);
    });

    it("handles malformed tokens", () => {
        const bad = { accessToken: "not-a-jwt", refreshToken: "r" };
        expect(decodeJwtPayload(bad.accessToken)).toBeNull();
        expect(decodeJwtPayload("a.!!!.c")).toBeNull();
        expect(isExpired(bad)).toBe(false);
        expect(preferredCurrency(bad)).toBeUndefined();
    });

    it("decodes base64url payloads without padding", () => {
        const payload = Buffer.from(JSON.stringify({ preferredCurrency: "EUR", sub: "??>>" }))
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
        expect(decodeJwtPayload(`h.${payload}.s`)).toEqual({
            preferredCurrency: "EUR",
            sub: "??>>",
        });
    });
});
