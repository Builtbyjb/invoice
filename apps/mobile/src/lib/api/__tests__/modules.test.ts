import { tokenStore } from "../../auth/token-store";
import { demoInvoiceJson } from "../../demo-data";
import { makeToken } from "../../../test-utils/jwt";

import { signUp, verifyOtp } from "../auth";
import { getClient, listClients, searchClients } from "../clients";
import { getMonthlyRevenue } from "../dashboard";
import { createInvoice, toInvoiceRequest } from "../invoices";

const fetchMock = jest.fn();
const ok = (body: unknown) => ({
    status: 200,
    statusText: "",
    url: "",
    text: async () => JSON.stringify(body),
});
const lastCall = () => {
    const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
    return { url, init, body: init.body ? JSON.parse(init.body as string) : undefined };
};

beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(async () => {
    fetchMock.mockReset();
    await tokenStore.save(makeToken({}));
});

describe("auth API", () => {
    it("maps sign-up fields to the backend keys", async () => {
        fetchMock.mockResolvedValueOnce(ok({ message: "sent", accessToken: "temp" }));
        await signUp({
            firstName: "John",
            lastName: "Doe",
            email: "j@d.com",
            businessName: "Acme",
            country: "Canada",
            referral: "",
        });
        expect(lastCall().url).toBe("http://localhost:8585/api/v1/auth/signup");
        expect(lastCall().body).toEqual({
            email: "j@d.com",
            firstname: "John",
            lastname: "Doe",
            referral: "",
            businessName: "Acme",
            country: "Canada",
        });
    });

    it("verifies OTP with the temp token and does not persist the result", async () => {
        await tokenStore.delete();
        fetchMock.mockResolvedValueOnce(ok({ accessToken: "a", refreshToken: "r" }));
        await expect(verifyOtp("12345678", "temp")).resolves.toEqual({
            accessToken: "a",
            refreshToken: "r",
        });
        expect((lastCall().init.headers as Record<string, string>).Authorization).toBe(
            "Bearer temp",
        );
        expect(lastCall().body).toEqual({ code: "12345678" });
        expect(await tokenStore.read()).toBeNull();
    });
});

describe("envelope endpoints", () => {
    const client = {
        id: "c1",
        organizationID: 1,
        name: "Acme",
        email: "a@a.com",
        phone: "",
        address: "",
        city: "",
        country: "",
        note: null,
        createdAt: "2026-01-01",
    };

    it("lists (data ?? [])", async () => {
        fetchMock.mockResolvedValueOnce(ok({ message: "ok", data: [client] }));
        await expect(listClients()).resolves.toEqual([client]);
        fetchMock.mockResolvedValueOnce(ok({ message: "ok", data: null }));
        await expect(listClients()).resolves.toEqual([]);
    });

    it("searches by name", async () => {
        fetchMock.mockResolvedValueOnce(ok({ message: "ok", data: [] }));
        await searchClients("ac me");
        expect(lastCall().url).toBe("http://localhost:8585/api/v1/clients?name=ac%20me");
    });

    it("requires data for single-item endpoints", async () => {
        fetchMock.mockResolvedValueOnce(ok({ message: "ok" }));
        await expect(getClient("c1")).rejects.toThrow("Failed to decode response");
    });

    it("creates invoices from form values", async () => {
        const req = toInvoiceRequest(
            {
                client: { id: "c1", name: "Acme", email: "" },
                status: "sent",
                currency: "EUR",
                issueDate: new Date("2026-09-26T16:25:00.123Z"),
                dueDate: new Date("2026-10-26T16:25:00.999Z"),
                items: [
                    { id: "u1", description: "Work", quantity: "2", unit: "hr", price: "49.5" },
                ],
                discount: "",
                tax: "10",
                signature: [{ points: [{ x: 1, y: 2 }] }],
                notes: "n",
            },
            "c2",
        );
        expect(req).toEqual({
            clientID: "c2",
            status: "sent",
            issueDate: "2026-09-26T16:25:00Z",
            dueDate: "2026-10-26T16:25:00Z",
            items: [{ id: "u1", description: "Work", quantity: 2, unit: "hr", price: 49.5 }],
            taxRate: 10,
            discount: 0,
            currency: "EUR",
            notes: "n",
            signature: '[{"points":[{"x":1,"y":2}]}]',
        });
        fetchMock.mockResolvedValueOnce(ok({ message: "created", data: demoInvoiceJson }));
        const created = await createInvoice(req);
        expect(created.invoiceNumber).toBe("INV-001");
        expect(lastCall().init.method).toBe("POST");
    });
});

describe("dashboard API", () => {
    it("omits year for Lifetime", async () => {
        fetchMock.mockResolvedValue(ok([{ month: "Jan", amount: 1 }]));
        await getMonthlyRevenue({ currency: "USD" });
        expect(lastCall().url).toBe(
            "http://localhost:8585/api/v1/user/dashboard/revenues?currency=USD",
        );
        await getMonthlyRevenue({ currency: "NGN", year: "2025" });
        expect(lastCall().url).toBe(
            "http://localhost:8585/api/v1/user/dashboard/revenues?currency=NGN&year=2025",
        );
    });
});
