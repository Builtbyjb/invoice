import { startOfDay } from 'date-fns';
import { z } from 'zod';

import { isoDate, requiredString } from './common';

export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue'] as const;
export const invoiceStatusSchema = z.enum(INVOICE_STATUSES);
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export const pointSchema = z.object({ x: z.number(), y: z.number() });
export type Point = z.infer<typeof pointSchema>;

export const strokeSchema = z.object({ points: z.array(pointSchema) });
export type Stroke = z.infer<typeof strokeSchema>;

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number(),
  unit: z.string(),
  price: z.number(),
});
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

export const clientInfoSchema = z.object({
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
});
export type ClientInfo = z.infer<typeof clientInfoSchema>;

export const invoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  clientID: z.string(),
  clientName: z.string(),
  clientInfo: clientInfoSchema,
  items: z.array(invoiceItemSchema),
  taxRate: z.number(),
  discount: z.number(),
  status: invoiceStatusSchema,
  signature: z.string().nullish(),
  issueDate: isoDate,
  dueDate: isoDate,
  createdAt: isoDate,
  currency: z.string(),
  notes: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
});
export type Invoice = z.output<typeof invoiceSchema>;

/** Body of the create/edit invoice endpoints. Dates are ISO-8601 without fractional seconds. */
export type InvoiceRequest = {
  clientID: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  discount: number;
  currency: string;
  notes: string;
  signature: string | null;
};

const DECIMAL_REGEX = /^\d*\.?\d*$/;

/** Numeric input kept as a string while editing. `''` is allowed and counts as 0. */
const decimalString = (label: string, { min = 0, max }: { min?: number; max?: number } = {}) =>
  z
    .string()
    .trim()
    .refine(
      (s) =>
        s === '' ||
        (DECIMAL_REGEX.test(s) && s !== '.' && Number(s) >= min && (max === undefined || Number(s) <= max)),
      max === undefined ? `${label} must be a number ≥ ${min}.` : `${label} must be between ${min} and ${max}.`,
    );

export const invoiceItemFormSchema = z.object({
  id: z.string(),
  description: requiredString('Description'),
  quantity: decimalString('Quantity').refine((s) => Number(s) > 0, 'Quantity must be greater than 0.'),
  unit: z.string().trim(),
  price: decimalString('Price'),
});
export type InvoiceItemFormValues = z.input<typeof invoiceItemFormSchema>;

export const invoiceClientSchema = z.object({ id: z.string(), name: z.string(), email: z.string() });
export type InvoiceClient = z.infer<typeof invoiceClientSchema>;

export const invoiceFormSchema = z
  .object({
    client: invoiceClientSchema.nullable(),
    status: invoiceStatusSchema,
    currency: z.string().length(3, 'Currency is required.'),
    issueDate: z.date(),
    dueDate: z.date(),
    items: z.array(invoiceItemFormSchema).min(1, 'Add at least one line item.'),
    discount: decimalString('Discount', { max: 100 }),
    tax: decimalString('Tax', { max: 100 }),
    signature: z.array(strokeSchema),
    notes: z.string(),
  })
  .refine((v) => v.client !== null, { path: ['client'], message: 'Client is required.' })
  .refine((v) => v.dueDate >= startOfDay(v.issueDate), {
    path: ['dueDate'],
    message: 'Due date must be on or after the issue date.',
  });
export type InvoiceFormValues = z.input<typeof invoiceFormSchema>;
export type InvoiceFormOutput = z.output<typeof invoiceFormSchema>;
