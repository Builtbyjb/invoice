import type { Invoice } from '@/schemas/invoice';
import type { SearchToken } from '@/stores/coordinator-store';

/**
 * Client-side invoice filtering (Swift's search was never wired, rewrite plan §6 #5):
 * a `client` token keeps that client's invoices; text matches invoice number or client name.
 */
export function filterInvoices(invoices: readonly Invoice[], token: SearchToken | null, text: string): Invoice[] {
  const q = text.trim().toLowerCase();
  return invoices.filter((inv) => {
    if (token?.tag === 'client' && inv.clientID !== token.value) return false;
    if (q && !inv.invoiceNumber.toLowerCase().includes(q) && !inv.clientName.toLowerCase().includes(q)) return false;
    return true;
  });
}
