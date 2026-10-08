import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SignupFormType } from "@/hooks/useSignupForm";

type Props = {
  form: SignupFormType;
};

/* Business Information  */
export default function Step2({ form }: Props) {
  return (
    <Field>
      <form.Field
        name="businessName"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="business-name-input">
                Business Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                required
                id="business-name-input"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="businessType"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="business-type-input">
                Business Type <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                required
                id="business-type-input"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="website"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="website-input">Website</FieldLabel>
              <Input
                id="website-input"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                autoComplete="off"
                placeholder="https://www.examplebusiness.com"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    </Field>
  );
}
