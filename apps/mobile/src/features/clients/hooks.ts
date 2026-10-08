import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

import {
    createClient,
    deleteClient,
    getClient,
    listClients,
    searchClients,
    updateClient,
} from "../../lib/api/clients";
import { qk } from "../../lib/query/keys";
import type { Client, ClientFormOutput } from "../../schemas/client";

const fromListCache = (queryClient: QueryClient, id: string) =>
    queryClient.getQueryData<Client[]>(qk.clients.list())?.find((c) => c.id === id);

export function useClients() {
    return useQuery({ queryKey: qk.clients.list(), queryFn: ({ signal }) => listClients(signal) });
}

export function useClientSearch(query: string, enabled = true) {
    return useQuery({
        queryKey: qk.clients.search(query),
        queryFn: ({ signal }) => searchClients(query, signal),
        enabled,
        staleTime: 10_000,
    });
}

export function useClient(id: string) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: qk.clients.detail(id),
        queryFn: ({ signal }) => getClient(id, signal),
        initialData: () => fromListCache(queryClient, id),
        initialDataUpdatedAt: () => queryClient.getQueryState(qk.clients.list())?.dataUpdatedAt,
    });
}

export function useCreateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (values: ClientFormOutput) => createClient(values),
        onSuccess: (client) => {
            // Swift inserted the new client at index 0.
            queryClient.setQueryData<Client[]>(qk.clients.list(), (list) =>
                list ? [client, ...list] : list,
            );
            queryClient.setQueryData(qk.clients.detail(client.id), client);
            void queryClient.invalidateQueries({ queryKey: qk.clients.all });
        },
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, values }: { id: string; values: ClientFormOutput }) =>
            updateClient(id, values),
        onSuccess: (client) => {
            queryClient.setQueryData(qk.clients.detail(client.id), client);
            queryClient.setQueryData<Client[]>(qk.clients.list(), (list) =>
                list?.map((c) => (c.id === client.id ? client : c)),
            );
            void queryClient.invalidateQueries({ queryKey: qk.clients.all });
            // The client name appears on invoices.
            void queryClient.invalidateQueries({ queryKey: qk.invoices.all });
        },
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteClient(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<Client[]>(qk.clients.list(), (list) =>
                list?.filter((c) => c.id !== id),
            );
            queryClient.removeQueries({ queryKey: qk.clients.detail(id) });
            void queryClient.invalidateQueries({ queryKey: qk.clients.all });
        },
    });
}
