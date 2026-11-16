import type { Currency, SelectData } from "./types";

export const APP_NAME = "ACorp Invoice";

export const CURRENCIES = [
    { label: "Naira", value: "NGN" },
    { label: "Canadian Dollar", value: "CAD" },
    { label: "US Dollar", value: "USD" },
];

export const CURRENCY_MAP: Record<string, Currency> = {
    NGN: { symbol: "₦", locale: "en-NG" },
    USD: { symbol: "$", locale: "en-US" },
    CAD: { symbol: "C$", locale: "en-CA" },
};

export const COUNTRY_VALUES = ["USA", "Canada", "Nigeria"] as const;
export type Country = (typeof COUNTRY_VALUES)[number];

export const COUNTRIES: SelectData[] = COUNTRY_VALUES.map((value) => ({ label: value, value }));
