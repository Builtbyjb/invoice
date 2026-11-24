import type { Context } from "hono";
import type { InvoiceNumber, InvoiceItem } from "@invoice/shared";

export function getNewInvoiceNumber(invoiceNumber: InvoiceNumber): InvoiceNumber {
    let year = 0;
    let currentNumber = 0;

    if (getCurrentYear() > invoiceNumber.year) {
        year = getCurrentYear();
        currentNumber = 1;
    } else {
        year = invoiceNumber.year;
        currentNumber = invoiceNumber.currentNumber + 1;
    }

    return { year, currentNumber };
}

export function getBlobURL(c: Context, key: string): string {
    return `${c.env.SERVER_URL}/api/v1/invoice/blobs/${key}`;
}

export function handleZodValidate(result: any, c: Context) {
    if (!result.success) {
        console.error(`Zod Validation Error: ${result.error}`);
        return c.json({ message: "Zod Validation Error" }, 400);
    }
}

export function fillTemplate(template: string, variables: Record<string, string>): string {
    return Object.entries(variables).reduce(
        (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
        template,
    );
}

export function getCurrentYear(): number {
    return new Date().getFullYear();
}

export function calculateTotalAmount(
    items: InvoiceItem[],
    taxRate: number,
    discount: number,
): number {
    const subtotal = calculateSubTotal(items);
    const taxAmount = calculateTaxAmount(subtotal, taxRate);
    const discountAmount = calculateDiscount(subtotal, discount);
    return subtotal + taxAmount - discountAmount;
}

export function calculateTaxAmount(subtotal: number, taxRate: number): number {
    return subtotal * (taxRate / 100);
}

export function calculateDiscount(subtotal: number, discount: number): number {
    return subtotal * (discount / 100);
}

export function calculateSubTotal(items: InvoiceItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}
