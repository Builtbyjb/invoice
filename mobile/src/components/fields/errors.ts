import { useStore, type AnyFieldApi } from '@tanstack/react-form';

/** First error message from TanStack field errors (Standard Schema issues are objects). */
export const firstError = (errors: readonly unknown[]): string | undefined => {
  const e = errors.find(Boolean);
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') return e.message;
  return undefined;
};

/** The field's error, shown only once the field was blurred or the form was submitted. */
export function useFieldError(field: AnyFieldApi): string | undefined {
  const submitted = useStore(field.form.store, (s) => s.submissionAttempts > 0);
  const { isBlurred, errors } = field.state.meta;
  return isBlurred || submitted ? firstError(errors) : undefined;
}
