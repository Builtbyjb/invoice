import { z } from 'zod';

import { emailField, requiredString } from './common';

export const clientSchema = z.object({
  id: z.string(),
  organizationID: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  note: z.string().nullish(),
  createdAt: z.string(),
});
export type Client = z.infer<typeof clientSchema>;

export const clientFormSchema = z.object({
  name: requiredString('Name'),
  // Swift only required a non-empty email; the format check is a deliberate fix (rewrite plan §6 #19).
  email: emailField,
  phone: z.string().trim(),
  address: z.string().trim(),
  city: z.string().trim(),
  country: z.string().trim(),
  note: z.string(),
});
export type ClientFormValues = z.input<typeof clientFormSchema>;
export type ClientFormOutput = z.output<typeof clientFormSchema>;

export function toClientFormValues(client?: Client | null): ClientFormValues {
  return {
    name: client?.name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    address: client?.address ?? '',
    city: client?.city ?? '',
    country: client?.country ?? '',
    note: client?.note ?? '',
  };
}
