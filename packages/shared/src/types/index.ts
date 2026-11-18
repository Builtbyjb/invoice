import { Schema as S } from "effect"
import { InvoiceSchema, InvoiceItemSchema } from "../schemas"

export type Invoice = S.Schema.Type<typeof InvoiceSchema>
export type InvoiceItem = S.Schema.Type<typeof InvoiceItemSchema>

export type Country = {
    name: string;
    currency: string;
};
