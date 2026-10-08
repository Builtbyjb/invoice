import { apiRequest } from "../../lib/api/client";
import { tokenStore } from "../../lib/auth/token-store";
import { makeToken } from "../../test-utils/jwt";
import { z } from "zod";

import { useAuthStore } from "../auth-store";
import { useCoordinatorStore } from "../coordinator-store";

describe("coordinator store", () => {
    it("consumes the pending invoice search token once", () => {
        const token = { tag: "client", value: "c1", label: "Acme" };
        useCoordinatorStore.getState().setPendingInvoiceSearchToken(token);
        expect(useCoordinatorStore.getState().consumePendingInvoiceSearchToken()).toEqual(token);
        expect(useCoordinatorStore.getState().consumePendingInvoiceSearchToken()).toBeNull();
    });

    it("consumes the pending deep link once", () => {
        useCoordinatorStore.getState().setPendingDeepLink({ type: "invoice", id: "i1" });
        expect(useCoordinatorStore.getState().consumePendingDeepLink()).toEqual({
            type: "invoice",
            id: "i1",
        });
        expect(useCoordinatorStore.getState().consumePendingDeepLink()).toBeNull();
    });
});

describe("unauthorized handler wiring", () => {
    it("a 401 with a failing refresh signs the user out", async () => {
        await tokenStore.save(makeToken({}, "r"));
        useAuthStore.setState({ state: "authenticated" });
        useCoordinatorStore
            .getState()
            .setPendingInvoiceSearchToken({ tag: "client", value: "c", label: "C" });
        global.fetch = jest.fn(async () => ({
            status: 401,
            statusText: "",
            url: "",
            text: async () => "",
        })) as unknown as typeof fetch;

        await expect(
            apiRequest({ path: "/x", method: "GET", schema: z.object({}), requiresAuth: true }),
        ).rejects.toMatchObject({
            kind: "unauthorized",
        });
        expect(useAuthStore.getState().state).toBe("notAuthenticated");
        expect(useCoordinatorStore.getState().pendingInvoiceSearchToken).toBeNull();
        expect(await tokenStore.read()).toBeNull();
    });

    it("ignores stray 401s after sign-out", async () => {
        useAuthStore.setState({ state: "notAuthenticated" });
        await expect(
            apiRequest({ path: "/x", method: "GET", schema: z.object({}), requiresAuth: true }),
        ).rejects.toMatchObject({
            kind: "unauthorized",
        });
        expect(useAuthStore.getState().state).toBe("notAuthenticated");
    });

    it("cancelOtp clears the pending OTP", () => {
        useAuthStore.getState().beginOtp("a@b.co", "t");
        useAuthStore.getState().cancelOtp();
        expect(useAuthStore.getState().pendingOtp).toBeNull();
    });
});
