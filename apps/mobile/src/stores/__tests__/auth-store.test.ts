import { refresh } from "../../lib/api/auth";
import { tokenStore } from "../../lib/auth/token-store";
import { queryClient } from "../../lib/query/query-client";
import { makeToken } from "../../test-utils/jwt";

import { useAuthStore } from "../auth-store";
import { useNotificationStore } from "../notification-store";

jest.mock("@/lib/api/auth", () => ({ refresh: jest.fn() }));

const refreshMock = refresh as jest.MockedFunction<typeof refresh>;
const now = () => Math.floor(Date.now() / 1000);

beforeEach(async () => {
    refreshMock.mockReset();
    await tokenStore.delete();
    tokenStore.resetCache();
    useAuthStore.setState({ state: "undefined", pendingOtp: null });
});

describe("auth store initialize()", () => {
    it("no token → notAuthenticated", async () => {
        await useAuthStore.getState().initialize();
        expect(useAuthStore.getState().state).toBe("notAuthenticated");
        expect(refreshMock).not.toHaveBeenCalled();
    });

    it("valid token → authenticated without refreshing", async () => {
        await tokenStore.save(makeToken({ exp: now() + 3600 }));
        await useAuthStore.getState().initialize();
        expect(useAuthStore.getState().state).toBe("authenticated");
        expect(refreshMock).not.toHaveBeenCalled();
    });

    it("expired token + successful refresh → authenticated with the new token saved", async () => {
        await tokenStore.save(makeToken({ exp: now() - 100 }, "r-old"));
        const next = makeToken({ exp: now() + 3600 }, "r-new");
        refreshMock.mockResolvedValueOnce(next);
        await useAuthStore.getState().initialize();
        expect(refreshMock).toHaveBeenCalledWith("r-old");
        expect(useAuthStore.getState().state).toBe("authenticated");
        tokenStore.resetCache();
        expect(await tokenStore.read()).toEqual(next);
    });

    it("expired token + failing refresh → notAuthenticated and token deleted", async () => {
        await tokenStore.save(makeToken({ exp: now() - 100 }));
        refreshMock.mockRejectedValueOnce(new Error("Error 401: expired"));
        await useAuthStore.getState().initialize();
        expect(useAuthStore.getState().state).toBe("notAuthenticated");
        expect(await tokenStore.read()).toBeNull();
    });
});

describe("OTP flow", () => {
    it("keeps the temp token in memory only and persists the real token on completion", async () => {
        useAuthStore.getState().beginOtp("a@b.com", "temp");
        expect(useAuthStore.getState().pendingOtp).toEqual({ email: "a@b.com", tempToken: "temp" });
        expect(await tokenStore.read()).toBeNull();

        const token = makeToken({});
        await useAuthStore.getState().completeOtp(token);
        expect(useAuthStore.getState()).toMatchObject({ state: "authenticated", pendingOtp: null });
        expect(await tokenStore.read()).toEqual(token);
    });
});

describe("handleUnauthorized()", () => {
    it("clears the token, query cache and notifications", async () => {
        await tokenStore.save(makeToken({}));
        useAuthStore.setState({ state: "authenticated" });
        queryClient.setQueryData(["clients", "list"], [1]);
        useNotificationStore.setState({
            notifications: [
                {
                    id: "1",
                    title: "",
                    body: "",
                    kind: "system",
                    isRead: false,
                    createdAt: new Date(),
                },
            ],
        });

        useAuthStore.getState().signOut();

        expect(useAuthStore.getState().state).toBe("notAuthenticated");
        expect(await tokenStore.read()).toBeNull();
        expect(queryClient.getQueryData(["clients", "list"])).toBeUndefined();
        expect(useNotificationStore.getState().notifications).toEqual([]);
    });
});
