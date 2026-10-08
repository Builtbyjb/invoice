import * as Crypto from "expo-crypto";

import { decimalText } from "../../lib/format";
import { parseSignature } from "../../lib/signature";
import type { Invoice, InvoiceFormValues, InvoiceItemFormValues } from "../../schemas/invoice";

export const newLineItem = (): InvoiceItemFormValues => ({
    id: Crypto.randomUUID(),
    description: "",
    quantity: "1",
    unit: "",
    price: "",
});

export function toInvoiceFormValues(
    invoice: Invoice | null,
    preferredCurrency: string,
): InvoiceFormValues {
    if (!invoice) {
        const today = new Date();
        return {
            client: null,
            status: "draft",
            currency: preferredCurrency,
            issueDate: today,
            dueDate: today,
            items: [],
            discount: "",
            tax: "",
            signature: [],
            notes: "",
        };
    }
    return {
        client: { id: invoice.clientID, name: invoice.clientName, email: invoice.clientInfo.email },
        status: invoice.status,
        currency: invoice.currency,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        items: invoice.items.map((item) => ({
            id: item.id,
            description: item.description,
            // Quantity keeps "0" visible rather than blank so the row stays editable.
            quantity: decimalText(item.quantity) || "0",
            unit: item.unit,
            price: decimalText(item.price),
        })),
        // Pre-filled (Swift left these blank, rewrite plan §6 #11).
        discount: decimalText(invoice.discount),
        tax: decimalText(invoice.taxRate),
        signature: parseSignature(invoice.signature),
        notes: invoice.notes,
    };
}
