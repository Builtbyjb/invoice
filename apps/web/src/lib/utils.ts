import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY_MAP } from "./constant";
import { toast } from "sonner";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency?: string): string {
    if (currency) {
        const config = CURRENCY_MAP[currency];
        return new Intl.NumberFormat(config.locale, {
            style: "currency",
            currency: currency,
        }).format(amount);
    } else {
        return new Intl.NumberFormat("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }
}

export function getBadgeVariant(action: string): string {
    const black = "bg-black text-white";
    const gray = "bg-neutral-100 text-neutral-700";
    const dark = "bg-neutral-800 text-white";

    switch (action) {
        case "active":
            return black;
        case "blue":
            return dark;
        case "non-renewing":
            return gray;
        case "disabled":
            return dark;
        case "paid":
            return black;
        case "sent":
            return dark;
        case "draft":
            return gray;
        case "overdue":
            return dark;
        case "cancelled":
            return dark;
        default:
            return gray;
    }
}

export function handleError(error: unknown) {
    if (error instanceof z.ZodError) {
        toast.error("Something went wrong. Please report this issue through the feedback page");
    } else if (error instanceof Error) {
        toast.error(error.message);
    }

    console.error(error);
}
