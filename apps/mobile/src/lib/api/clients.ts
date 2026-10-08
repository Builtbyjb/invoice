import { clientSchema, type Client, type ClientFormOutput } from "../../schemas/client";

import { requestData, requestList } from "./envelope";

const body = (v: ClientFormOutput) => ({
    name: v.name,
    email: v.email,
    phone: v.phone,
    address: v.address,
    city: v.city,
    country: v.country,
    note: v.note,
});

export function listClients(signal?: AbortSignal): Promise<Client[]> {
    return requestList({ path: "/api/v1/clients", method: "GET", data: clientSchema, signal });
}

export function searchClients(name: string, signal?: AbortSignal): Promise<Client[]> {
    return requestList({
        path: "/api/v1/clients",
        method: "GET",
        query: { name },
        data: clientSchema,
        signal,
    });
}

export function getClient(id: string, signal?: AbortSignal): Promise<Client> {
    return requestData({
        path: `/api/v1/clients/${encodeURIComponent(id)}`,
        method: "GET",
        data: clientSchema,
        signal,
    });
}

export function createClient(values: ClientFormOutput): Promise<Client> {
    return requestData({
        path: "/api/v1/clients/create",
        method: "POST",
        body: body(values),
        data: clientSchema,
    });
}

export function updateClient(id: string, values: ClientFormOutput): Promise<Client> {
    return requestData({
        path: `/api/v1/clients/${encodeURIComponent(id)}/edit`,
        method: "PUT",
        body: body(values),
        data: clientSchema,
    });
}

export function deleteClient(id: string): Promise<Client> {
    return requestData({
        path: `/api/v1/clients/${encodeURIComponent(id)}/delete`,
        method: "DELETE",
        data: clientSchema,
    });
}
