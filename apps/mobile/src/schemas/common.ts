import { z } from 'zod';

/** Response dates (ISO-8601 strings) → Date. Rejects unparseable strings. */
export const isoDate = z.string().transform((s, ctx) => {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) {
    ctx.addIssue({ code: 'custom', message: `Invalid date: ${s}` });
    return z.NEVER;
  }
  return d;
});

export const paginationMetaSchema = z.object({
  totalCount: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  perPage: z.number(),
});

/** `{ message, data?, meta? }` envelope used by the client and invoice endpoints. */
export const envelope = <T extends z.ZodType>(data: T) =>
  z.object({
    message: z.string(),
    data: data.nullish(),
    meta: paginationMetaSchema.nullish(),
  });

export const apiErrorSchema = z.object({ message: z.string() });

// Same regex as Swift String.isValidEmail — do NOT replace with z.email(), whose rules differ.
export const EMAIL_REGEX = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const requiredString = (field: string) => z.string().trim().min(1, `${field} is required.`);

export const emailField = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .regex(EMAIL_REGEX, 'Please enter a valid email address.');
