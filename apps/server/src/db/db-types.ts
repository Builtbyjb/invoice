import { invoices, clients, users, organizations } from "./schema"

export type InvoiceEntry = typeof invoices.$inferSelect
export type ClientEntry = typeof clients.$inferSelect
export type UserEntry = typeof users.$inferSelect
export type OrgEntry = typeof organizations.$inferSelect
