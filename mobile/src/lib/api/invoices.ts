import { toApiDate } from '@/lib/format';
import { parseDecimal } from '@/lib/invoice-math';
import { serializeSignature } from '@/lib/signature';
import { invoiceSchema, type Invoice, type InvoiceFormOutput, type InvoiceRequest } from '@/schemas/invoice';

import { requestData, requestList } from './envelope';

/** Form values → request body: numeric strings → numbers, dates → ISO (no ms), strokes → JSON string | null. */
export function toInvoiceRequest(values: InvoiceFormOutput, clientId: string): InvoiceRequest {
  return {
    clientID: clientId,
    status: values.status,
    issueDate: toApiDate(values.issueDate),
    dueDate: toApiDate(values.dueDate),
    items: values.items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: parseDecimal(item.quantity),
      unit: item.unit,
      price: parseDecimal(item.price),
    })),
    taxRate: parseDecimal(values.tax),
    discount: parseDecimal(values.discount),
    currency: values.currency,
    notes: values.notes,
    signature: serializeSignature(values.signature),
  };
}

export function listInvoices(signal?: AbortSignal): Promise<Invoice[]> {
  return requestList({ path: '/api/v1/invoices', method: 'GET', data: invoiceSchema, signal });
}

export function getInvoice(id: string, signal?: AbortSignal): Promise<Invoice> {
  return requestData({ path: `/api/v1/invoices/${encodeURIComponent(id)}`, method: 'GET', data: invoiceSchema, signal });
}

export function createInvoice(req: InvoiceRequest): Promise<Invoice> {
  return requestData({ path: '/api/v1/invoices/create', method: 'POST', body: req, data: invoiceSchema });
}

export function updateInvoice(id: string, req: InvoiceRequest): Promise<Invoice> {
  return requestData({
    path: `/api/v1/invoices/${encodeURIComponent(id)}/edit`,
    method: 'PUT',
    body: req,
    data: invoiceSchema,
  });
}

export function deleteInvoice(id: string): Promise<Invoice> {
  return requestData({
    path: `/api/v1/invoices/${encodeURIComponent(id)}/delete`,
    method: 'DELETE',
    data: invoiceSchema,
  });
}
