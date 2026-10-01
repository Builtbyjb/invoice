import type { ThemeColors } from "@/constants/theme";
import type { MonthlyRevenue } from "@/schemas/dashboard";

import { LIFETIME } from "./hooks";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Jan→Dec; unknown months sort first (Swift `monthOrder` returns 0). */
export const monthOrder = (month: string) => MONTHS.indexOf(month) + 1;

export const sortByMonth = (data: readonly MonthlyRevenue[]) =>
    [...data].sort((a, b) => monthOrder(a.month) - monthOrder(b.month));

export const BASE_CURRENCIES = ["USD", "EUR", "GBP", "NGN"];

export function availableYears(now = new Date()): string[] {
    const year = now.getFullYear();
    return [LIFETIME, ...Array.from({ length: 6 }, (_, i) => String(year - i))];
}

export function availableCurrencies(selected: string): string[] {
    return BASE_CURRENCIES.includes(selected) ? BASE_CURRENCIES : [...BASE_CURRENCIES, selected];
}

export function currencyColor(currency: string, colors: ThemeColors): string {
    switch (currency) {
        case "USD":
            return colors.blue;
        case "EUR":
            return colors.green;
        case "GBP":
            return colors.orange;
        case "NGN":
            return colors.purple;
        default:
            return colors.gray;
    }
}

/** Compact axis labels: 1200 → "1.2K", 3_400_000 → "3.4M". */
export function compactNumber(n: number): string {
    const abs = Math.abs(n);
    const fmt = (v: number, suffix: string) => `${Number(v.toFixed(1))}${suffix}`;
    if (abs >= 1e9) return fmt(n / 1e9, "B");
    if (abs >= 1e6) return fmt(n / 1e6, "M");
    if (abs >= 1e3) return fmt(n / 1e3, "K");
    return String(Math.round(n));
}
