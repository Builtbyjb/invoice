import { Schema as S } from "effect";
import { InvoiceSchema, InvoiceItemSchema, ClientInfoSchema } from "../schemas";

export type Invoice = S.Schema.Type<typeof InvoiceSchema>;
export type InvoiceItem = S.Schema.Type<typeof InvoiceItemSchema>;
export type ClientInfo = S.Schema.Type<typeof ClientInfoSchema>;

export type InvoiceNumber = {
    currentNumber: number;
    year: number;
};

export type Country = {
    name: string;
    currency: string;
};
