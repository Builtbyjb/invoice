import { Schema as S, Effect } from "effect"

export const UserSchema = S.Struct({
    firstname: S.String,
    avatar: S.File
})

export const UserSettingSchema = S.Struct({
    firstname: S.String,
    avatarURL: S.NullOr(S.String),
})

export const BusinessSchema = S.Struct({
    name: S.String,
    email: S.String,
    website: S.NullOr(S.String),
    address: S.String,
    city: S.String,
    country: S.String,
    logo: S.File
})

export const TopStatsSchema = S.Struct({
    totalRevenue: S.Finite,
    paidInvoices: S.Finite,
    pendingInvoices: S.Finite,
    totalClients: S.Finite,
})

export const FeedBackSchema = S.Struct({
    subject: S.NullOr(S.String),
    description: S.String,
})

/*---------- Client Schemas -------- */
export const ClientQuerySchema = S.Struct({
    name: S.NullOr(S.String),
    page: S.NullOr(S.Finite).pipe(S.withConstructorDefault(Effect.succeed(1))),
    size: S.NullOr(S.Finite).pipe(S.withConstructorDefault(Effect.succeed(10)))
})

export const ClientRequestSchema = S.Struct({
    name: S.NonEmptyString,
    email: S.String,
    phone: S.String,
    address: S.String,
    city: S.String,
    country: S.String,
    note: S.String,
})

export const ClientSchema = S.Struct({
    id: S.String,
    organizationID: S.String,
    name: S.String,
    email: S.String,
    phone: S.String,
    address: S.String,
    city: S.String,
    country: S.String,
    note: S.NullOr(S.String),
    createdAt: S.Date
})

/*---------- Invoice Schemas -------*/
export const InvoiceQuerySchema = S.Struct({
    clientID: S.NullOr(S.String),
    invoiceID: S.NullOr(S.String),
    page: S.NullOr(S.Finite).pipe(S.withConstructorDefault(Effect.succeed(1))),
    size: S.NullOr(S.Finite).pipe(S.withConstructorDefault(Effect.succeed(10)))
})

export const ClientInfoSchema = S.Struct({
    name: S.String,
    email: S.String,
    phone: S.String,
    address: S.String,
    city: S.String,
    country: S.String,
})

export enum InvoiceStatus {
    draft = "draft",
    sent = "sent",
    paid = "paid",
    overdue = "overdue"
}

export const InvoiceStatusSchema = S.Enum(InvoiceStatus)

export const InvoiceItemSchema = S.Struct({
    id: S.String,
    description: S.String,
    quantity: S.Finite,
    unit: S.NullOr(S.String),
    price: S.Finite
})

export const InvoiceRequestSchema = S.Struct({
    clientID: S.String,
    issueDate: S.Date,
    dueDate: S.Date,
    discount: S.Finite.check(S.isBetween({ minimum: 0, maximum: 100 })),
    taxRate: S.Finite.check(S.isBetween({ minimum: 0, maximum: 100 })),
    status: InvoiceStatusSchema,
    items: S.Array(InvoiceItemSchema),
    currency: S.String,
    notes: S.String,
    signature: S.NullOr(S.String)
})

export const InvoiceSchema = S.Struct({
    id: S.String,
    invoiceNumber: S.String,
    clientID: S.String,
    clientInfo: ClientInfoSchema,
    items: S.Array(InvoiceItemSchema),
    taxRate: S.Finite.check(S.isBetween({ minimum: 0, maximum: 100 })),
    discount: S.Finite.check(S.isBetween({ minimum: 0, maximum: 100 })),
    status: InvoiceStatusSchema,
    signature: S.NullOr(S.String),
    issueDate: S.Date,
    dueDate: S.Date,
    currency: S.String,
    notes: S.String,
    createdAt: S.Date
})

export const InvoiceListSchema = S.Array(InvoiceSchema)
