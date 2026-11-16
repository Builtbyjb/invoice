import { create } from 'zustand';

export type SearchToken = { tag: string; value: string; label: string };

export type DeepLink = { type: 'client' | 'invoice'; id: string };

type CoordinatorStore = {
  /** One-shot filter handed to the Invoices list when switching tabs from a client detail. */
  pendingInvoiceSearchToken: SearchToken | null;
  setPendingInvoiceSearchToken(token: SearchToken | null): void;
  consumePendingInvoiceSearchToken(): SearchToken | null;

  /** A deep link that arrived before the app navigator was ready (or before sign-in). */
  pendingDeepLink: DeepLink | null;
  setPendingDeepLink(link: DeepLink | null): void;
  consumePendingDeepLink(): DeepLink | null;
};

/** The non-navigation part of AppCoordinator.swift. */
export const useCoordinatorStore = create<CoordinatorStore>()((set, get) => ({
  pendingInvoiceSearchToken: null,
  setPendingInvoiceSearchToken: (token) => set({ pendingInvoiceSearchToken: token }),
  consumePendingInvoiceSearchToken: () => {
    const token = get().pendingInvoiceSearchToken;
    if (token) set({ pendingInvoiceSearchToken: null });
    return token;
  },

  pendingDeepLink: null,
  setPendingDeepLink: (link) => set({ pendingDeepLink: link }),
  consumePendingDeepLink: () => {
    const link = get().pendingDeepLink;
    if (link) set({ pendingDeepLink: null });
    return link;
  },
}));
