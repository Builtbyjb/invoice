import { ENV } from "@/lib/types";
import { ClientService } from "./service";
import { getDB } from "@/db/utils";
import { ClientRepository } from "./repository";
import { createMiddleware } from "hono/factory";
import { InvoiceRepository } from "../invoice/repository";

export interface ClientContext {
    Bindings: ENV;
    Variables: { service: ClientService };
}

export const clientMiddleware = createMiddleware<ClientContext>(
    async (c, next) => {
        const { db, client } = await getDB(c.env.DB.connectionString)
        const clientRepository = new ClientRepository(db)
        const invoiceRepository = new InvoiceRepository(db)
        const service = new ClientService(clientRepository, invoiceRepository)

        c.set("service", service)

        await next()

        c.executionCtx.waitUntil(client.end())
    }
)
