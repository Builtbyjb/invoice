import { demoInvoice, demoInvoiceJson } from '@/lib/demo-data';

import { clientFormSchema } from '../client';
import { invoiceFormSchema, invoiceSchema, type InvoiceFormValues } from '../invoice';

const validForm = (): InvoiceFormValues => ({
  client: { id: 'c1', name: 'Acme', email: 'a@acme.com' },
  status: 'draft',
  currency: 'USD',
  issueDate: new Date(2026, 8, 26, 15, 0),
  dueDate: new Date(2026, 8, 26, 9, 0),
  items: [{ id: 'i1', description: 'Work', quantity: '1', unit: 'hr', price: '100' }],
  discount: '',
  tax: '10',
  signature: [],
  notes: '',
});

const messagesAt = (values: InvoiceFormValues, path: string) => {
  const r = invoiceFormSchema.safeParse(values);
  return r.success ? [] : r.error.issues.filter((i) => i.path.join('.') === path).map((i) => i.message);
};

describe('invoiceSchema', () => {
  it('parses a fixture based on DemoData.invoice', () => {
    const parsed = invoiceSchema.parse(demoInvoiceJson);
    expect(parsed).toEqual(demoInvoice);
    expect(parsed.issueDate).toBeInstanceOf(Date);
  });

  it('accepts null notes and fractional-second dates', () => {
    const parsed = invoiceSchema.parse({
      ...demoInvoiceJson,
      notes: null,
      issueDate: '2026-09-26T16:25:00.123Z',
    });
    expect(parsed.notes).toBe('');
    expect(parsed.issueDate.toISOString()).toBe('2026-09-26T16:25:00.123Z');
  });

  it('rejects an unknown status', () => {
    expect(invoiceSchema.safeParse({ ...demoInvoiceJson, status: 'void' }).success).toBe(false);
  });
});

describe('invoiceFormSchema', () => {
  it('accepts a valid form (due date later the same day is fine)', () => {
    expect(invoiceFormSchema.safeParse(validForm()).success).toBe(true);
  });

  it('requires a client', () => {
    expect(messagesAt({ ...validForm(), client: null }, 'client')).toEqual(['Client is required.']);
  });

  it('requires at least one item', () => {
    expect(messagesAt({ ...validForm(), items: [] }, 'items')).toEqual(['Add at least one line item.']);
  });

  it('rejects a discount above 100', () => {
    expect(messagesAt({ ...validForm(), discount: '101' }, 'discount')).toEqual([
      'Discount must be between 0 and 100.',
    ]);
  });

  it('rejects non-numeric tax', () => {
    expect(messagesAt({ ...validForm(), tax: 'abc' }, 'tax')).toEqual(['Tax must be between 0 and 100.']);
  });

  it('rejects a due date before the issue date', () => {
    expect(messagesAt({ ...validForm(), dueDate: new Date(2026, 8, 25) }, 'dueDate')).toEqual([
      'Due date must be on or after the issue date.',
    ]);
  });

  it('validates line items', () => {
    const values = validForm();
    values.items = [{ id: 'i1', description: '', quantity: '0', unit: '', price: '-1' }];
    expect(messagesAt(values, 'items.0.description')).toEqual(['Description is required.']);
    expect(messagesAt(values, 'items.0.quantity')).toEqual(['Quantity must be greater than 0.']);
    expect(messagesAt(values, 'items.0.price')).toEqual(['Price must be a number ≥ 0.']);
  });
});

describe('clientFormSchema', () => {
  const base = { name: 'Acme', email: 'a@acme.com', phone: '', address: '', city: '', country: '', note: '' };

  it('requires name and a valid email', () => {
    expect(clientFormSchema.safeParse(base).success).toBe(true);
    const r = clientFormSchema.safeParse({ ...base, name: '', email: 'nope' });
    expect(r.error?.issues.map((i) => i.message)).toEqual([
      'Name is required.',
      'Please enter a valid email address.',
    ]);
  });
});
