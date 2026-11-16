import { useStore, type AnyFormApi } from '@tanstack/react-form';
import type { z } from 'zod';

/**
 * Mirrors Swift's computed `isFormValid`: true when the current values pass the schema.
 * (TanStack's `canSubmit` is true before any interaction, so it can't be used for this.)
 */
export function useSchemaValid(form: AnyFormApi, schema: z.ZodType): boolean {
  return useStore(form.store, (s) => schema.safeParse(s.values).success);
}
