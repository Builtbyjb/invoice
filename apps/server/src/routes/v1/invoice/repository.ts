import { InvoiceEntry } from "@/db/db-types";
import { invoices } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class InvoiceRepository {
    private readonly db: NodePgDatabase

    constructor(database: NodePgDatabase) {
        this.db = database
    }

    public async findInvoicesByClientID(clientID: string, limit: number, offset: number): Promise<{
        result: InvoiceEntry[], totalCount: number
    }> {
        const baseWhere = and(eq(invoices.clientID, clientID), eq(invoices.deleted, false))

        const [totalCount, result] = await Promise.all([
            this.db.$count(invoices, baseWhere),
            this.db
                .select()
                .from(invoices)
                .where(baseWhere)
                .orderBy(desc(invoices.createdAt))
                .limit(limit)
                .offset(offset)
        ])

        return { result, totalCount }
    }
}
