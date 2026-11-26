import { Schema as S } from "effect";
import {
    InvoiceSchema,
    InvoiceItemSchema,
    ClientInfoSchema,
    ClientSchema,
    URLQuerySchema,
    ClientRequestSchema
} from "../schemas";

export type Invoice = S.Schema.Type<typeof InvoiceSchema>;
export type InvoiceItem = S.Schema.Type<typeof InvoiceItemSchema>;
export type ClientInfo = S.Schema.Type<typeof ClientInfoSchema>;
export type Client = S.Schema.Type<typeof ClientSchema>;
export type URLQuery = S.Schema.Type<typeof URLQuerySchema>;
export type ClientRequest = S.Schema.Type<typeof ClientRequestSchema>;

export type InvoiceNumber = {
    currentNumber: number;
    year: number;
};

export type Country = {
    name: string;
    currency: string;
};

export type QueryResult<T> = {
    data: T;
    meta: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        perPage: number;
    }
}
