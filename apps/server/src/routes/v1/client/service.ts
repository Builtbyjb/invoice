import {
    ClientListSchema,
    ClientSchema,
    MAX_PAGE_SIZE,
    Client,
    QueryResult,
    Invoice,
    URLQuery,
    InvoiceListSchema,
    ClientRequest
} from "@invoice/shared";
import { ClientRepository } from "./repository";
import { Schema } from "effect";
import { HTTPException } from "hono/http-exception";
import { InvoiceRepository } from "../invoice/repository";

export class ClientService {
    private readonly clientRepo: ClientRepository
    private readonly invoiceRepo: InvoiceRepository

    constructor(clientRepository: ClientRepository, invoiceRepository: InvoiceRepository) {
        this.clientRepo = clientRepository
        this.invoiceRepo = invoiceRepository
    }

    public async getClients(orgID: number, page: number, size: number): Promise<
        QueryResult<readonly Client[]>
    > {
        const limit = Math.min(size, MAX_PAGE_SIZE);
        const offset = (page - 1) * limit;

        const { result, totalCount } = await this.clientRepo
            .findClientsByOrgID(orgID, limit, offset)

        return {
            data: Schema.decodeUnknownSync(ClientListSchema)(result),
            meta: {
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                perPage: limit,
            },
        };
    }

    public async getClient(clientID: string): Promise<Client> {
        const result = this.clientRepo.findClientByID(clientID)
        if (!result) throw new HTTPException(404, { message: "Client not found" })

        return Schema.decodeUnknownSync(ClientSchema)(result)
    }

    public async getClientInvoices(clientID: string, query: URLQuery): Promise<
        QueryResult<readonly Invoice[]>
    > {

        const limit = Math.min(query.size, MAX_PAGE_SIZE);
        const offset = (query.page - 1) * limit;

        const { result, totalCount } = await this.invoiceRepo
            .findInvoicesByClientID(clientID, limit, offset)

        return {
            data: Schema.decodeUnknownSync(InvoiceListSchema)(result),
            meta: {
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: query.page,
                perPage: limit
            }
        }
    }

    public async createClient(orgID: number, request: ClientRequest): Promise<Client> {
        const result = await this.clientRepo.createClientByOrgID(orgID, request)

        if (!result) throw new HTTPException(500, { message: "Error creating client" })

        return Schema.decodeUnknownSync(ClientSchema)(result)
    }

    public async updateClient(clientID: string, request: ClientRequest): Promise<Client> {
        const result = await this.clientRepo.updateClientByID(clientID, request)

        if (!result) throw new HTTPException(500, { message: "Error updating client" })

        return Schema.decodeUnknownSync(ClientSchema)(result)
    }

    public async deleteClient(clientID: string) {
        await this.clientRepo.deleteClientByID(clientID)
    }
}
