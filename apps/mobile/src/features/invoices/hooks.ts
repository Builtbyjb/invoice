import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createInvoice,
    deleteInvoice,
    getInvoice,
    listInvoices,
    updateInvoice,
} from "../../lib/api/invoices";
import { qk } from "../../lib/query/keys";
import type { Invoice, InvoiceRequest } from "../../schemas/invoice";

export function useInvoices() {
    return useQuery({
        queryKey: qk.invoices.list(),
        queryFn: ({ signal }) => listInvoices(signal),
    });
}

export function useInvoice(id: string) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: qk.invoices.detail(id),
        queryFn: ({ signal }) => getInvoice(id, signal),
        initialData: () =>
            queryClient.getQueryData<Invoice[]>(qk.invoices.list())?.find((i) => i.id === id),
        initialDataUpdatedAt: () => queryClient.getQueryState(qk.invoices.list())?.dataUpdatedAt,
    });
}

export function useCreateInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: InvoiceRequest) => createInvoice(req),
        onSuccess: (invoice) => {
            queryClient.setQueryData(qk.invoices.detail(invoice.id), invoice);
            void queryClient.invalidateQueries({ queryKey: qk.invoices.list() });
            void queryClient.invalidateQueries({ queryKey: qk.dashboard.all });
        },
    });
}

export function useUpdateInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, req }: { id: string; req: InvoiceRequest }) => updateInvoice(id, req),
        onSuccess: (invoice) => {
            queryClient.setQueryData(qk.invoices.detail(invoice.id), invoice);
            queryClient.setQueryData<Invoice[]>(qk.invoices.list(), (list) =>
                list?.map((i) => (i.id === invoice.id ? invoice : i)),
            );
            void queryClient.invalidateQueries({ queryKey: qk.invoices.list() });
            void queryClient.invalidateQueries({ queryKey: qk.dashboard.all });
        },
    });
}

export function useDeleteInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteInvoice(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<Invoice[]>(qk.invoices.list(), (list) =>
                list?.filter((i) => i.id !== id),
            );
            queryClient.removeQueries({ queryKey: qk.invoices.detail(id) });
            void queryClient.invalidateQueries({ queryKey: qk.invoices.list() });
            void queryClient.invalidateQueries({ queryKey: qk.dashboard.all });
        },
    });
}
