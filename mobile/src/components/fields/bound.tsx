import type { AnyFieldApi } from '@tanstack/react-form';
import type { ComponentProps } from 'react';

import { useFieldError } from './errors';
import { InlineIconTextField } from './InlineIconTextField';
import { TextField, type TextFieldProps } from './TextField';

type Bound<P> = Omit<P, 'value' | 'onChangeText' | 'onBlur' | 'error'> & { field: AnyFieldApi };

/** TextField wired to a TanStack string field. */
export function FormTextField({ field, ...props }: Bound<TextFieldProps>) {
  const error = useFieldError(field);
  return (
    <TextField
      {...props}
      value={field.state.value as string}
      onChangeText={field.handleChange}
      onBlur={field.handleBlur}
      error={error}
    />
  );
}

/** InlineIconTextField wired to a TanStack string field. */
export function FormInlineIconTextField({ field, ...props }: Bound<ComponentProps<typeof InlineIconTextField>>) {
  const error = useFieldError(field);
  return (
    <InlineIconTextField
      {...props}
      value={field.state.value as string}
      onChangeText={field.handleChange}
      onBlur={field.handleBlur}
      error={error}
    />
  );
}
