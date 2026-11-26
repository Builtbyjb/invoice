import { ClientEntry } from "@/db/db-types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, eq, desc } from "drizzle-orm";
import { clients } from "@/db/schema";
import { ClientRequest } from "@invoice/shared";

export class ClientRepository {
    private readonly db: NodePgDatabase

    constructor(database: NodePgDatabase) {
        this.db = database
    }

    public async findClientsByOrgID(orgID: number, limit: number, offset: number): Promise<{
        result: ClientEntry[], totalCount: number
    }> {
        const baseWhere = and(eq(clients.organizationID, orgID), eq(clients.deleted, false));

        const [totalCount, result] = await Promise.all([
            this.db.$count(clients, baseWhere),
            this.db
                .select()
                .from(clients)
                .where(baseWhere)
                .orderBy(desc(clients.createdAt))
                .limit(limit)
                .offset(offset),
        ]);

        return { result, totalCount }
    }

    public async findClientByID(clientID: string): Promise<ClientEntry | null> {
        const result = await this.db
            .select()
            .from(clients)
            .where(and(eq(clients.id, clientID), eq(clients.deleted, false)))
            .then((result) => result[0])

        if (!result) return null

        return result
    }

    public async createClientByOrgID(orgID: number, request: ClientRequest): Promise<
        ClientEntry | null
    > {
        const result = this.db
            .insert(clients)
            .values({
                id: crypto.randomUUID(),
                organizationID: orgID,
                name: request.name,
                email: request.email,
                phone: request.phone,
                address: request.address,
                city: request.city,
                country: request.country
            })
            .returning()
            .then((result) => result[0])

        if (!result) return null

        return result
    }

    public async updateClientByID(clientID: string, request: ClientRequest): Promise<
        ClientEntry | null
    > {
        const result = this.db
            .update(clients)
            .set({
                name: request.name,
                email: request.email,
                phone: request.email,
                address: request.address,
                city: request.city,
                country: request.country,
            })
            .where(eq(clients.id, clientID))
            .returning()
            .then((result) => result[0])

        if (!result) return null

        return result
    }

    public async deleteClientByID(clientID: string) {
        await this.db.update(clients).set({ deleted: true }).where(eq(clients.id, clientID))
    }
}
