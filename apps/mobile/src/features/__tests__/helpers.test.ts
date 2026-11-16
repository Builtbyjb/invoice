import { lightColors } from "../../constants/theme";
import { cityCountry } from "../clients/ClientCard";
import { toInvoiceFormValues } from "../invoices/form-values";
import { filterInvoices } from "../invoices/filter";
import {
    availableCurrencies,
    availableYears,
    compactNumber,
    currencyColor,
    sortByMonth,
} from "../home/revenue";
import { demoInvoice } from "../../lib/demo-data";

describe("filterInvoices", () => {
    const invoices = [
        {
            ...demoInvoice,
            id: "1",
            invoiceNumber: "INV-001",
            clientID: "c1",
            clientName: "Acme Corp",
        },
        { ...demoInvoice, id: "2", invoiceNumber: "INV-002", clientID: "c2", clientName: "Globex" },
        {
            ...demoInvoice,
            id: "3",
            invoiceNumber: "INV-003",
            clientID: "c1",
            clientName: "Acme Corp",
        },
    ];

    it("filters by client token", () => {
        const token = { tag: "client", value: "c1", label: "Acme Corp" };
        expect(filterInvoices(invoices, token, "").map((i) => i.id)).toEqual(["1", "3"]);
    });

    it("filters by invoice number or client name, case-insensitively", () => {
        expect(filterInvoices(invoices, null, "globex").map((i) => i.id)).toEqual(["2"]);
        expect(filterInvoices(invoices, null, "inv-003").map((i) => i.id)).toEqual(["3"]);
    });

    it("combines token and text", () => {
        const token = { tag: "client", value: "c1", label: "Acme Corp" };
        expect(filterInvoices(invoices, token, "003").map((i) => i.id)).toEqual(["3"]);
        expect(filterInvoices(invoices, null, "  ").length).toBe(3);
    });
});

describe("revenue helpers", () => {
    it("sorts months Jan→Dec with unknown months first", () => {
        const sorted = sortByMonth([
            { month: "Mar", amount: 1 },
            { month: "Jan", amount: 1 },
            { month: "???", amount: 1 },
            { month: "Dec", amount: 1 },
        ]);
        expect(sorted.map((m) => m.month)).toEqual(["???", "Jan", "Mar", "Dec"]);
    });

    it("lists Lifetime and the last six years", () => {
        expect(availableYears(new Date(2026, 5, 1))).toEqual([
            "Lifetime",
            "2026",
            "2025",
            "2024",
            "2023",
            "2022",
            "2021",
        ]);
    });

    it("adds a non-base selected currency", () => {
        expect(availableCurrencies("USD")).toEqual(["USD", "EUR", "GBP", "NGN"]);
        expect(availableCurrencies("CAD")).toEqual(["USD", "EUR", "GBP", "NGN", "CAD"]);
    });

    it("colors bars by currency", () => {
        expect(currencyColor("USD", lightColors)).toBe(lightColors.blue);
        expect(currencyColor("NGN", lightColors)).toBe(lightColors.purple);
        expect(currencyColor("CAD", lightColors)).toBe(lightColors.gray);
    });

    it("formats compact axis labels", () => {
        expect(compactNumber(950)).toBe("950");
        expect(compactNumber(1200)).toBe("1.2K");
        expect(compactNumber(3_400_000)).toBe("3.4M");
    });
});

describe("client card location", () => {
    it("joins city and country without dangling commas", () => {
        expect(cityCountry("Toronto", "Canada")).toBe("Toronto, Canada");
        expect(cityCountry("", "Canada")).toBe("Canada");
        expect(cityCountry("Toronto", "")).toBe("Toronto");
        expect(cityCountry("", "")).toBe("");
    });
});

describe("toInvoiceFormValues", () => {
    it("defaults create mode to the preferred currency", () => {
        const v = toInvoiceFormValues(null, "NGN");
        expect(v).toMatchObject({
            client: null,
            status: "draft",
            currency: "NGN",
            items: [],
            discount: "",
            tax: "",
        });
    });

    it("maps an invoice into form strings", () => {
        const v = toInvoiceFormValues(
            { ...demoInvoice, discount: 2.5, signature: '[{"points":[{"x":1,"y":2}]}]' },
            "USD",
        );
        expect(v.client).toEqual({
            id: "demo-client-1",
            name: "Acme Corp",
            email: "billing@acme.com",
        });
        expect(v.discount).toBe("2.5");
        expect(v.tax).toBe("10");
        expect(v.signature).toEqual([{ points: [{ x: 1, y: 2 }] }]);
    });
});
