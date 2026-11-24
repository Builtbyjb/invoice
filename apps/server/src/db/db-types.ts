import { invoices, clients } from "./schema"

export type InvoiceEntry = typeof invoices.$inferSelect
export type ClientEntry = typeof clients.$inferSelect
