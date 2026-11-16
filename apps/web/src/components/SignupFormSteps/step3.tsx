import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SelectField from "@/components/Form/SelectField";
import { COUNTRIES } from "@/lib/constant";
import type { SignupFormType } from "@/hooks/useSignupForm";

type Props = {
  form: SignupFormType;
};

/* Location Information */
export default function Step3({ form }: Props) {
  return (
    <Field>
      <form.Field
        name="businessAddress"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="business-address-input">
                Business Address <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                required
                id="business-address-input"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Street Address"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="city"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="business-city-input">
                City <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                required
                id="business-city-input"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="City, State ZIP"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="country"
        children={(field) => <SelectField field={field} id="country-select" label="Country" data={COUNTRIES} />}
      />
    </Field>
  );
}
