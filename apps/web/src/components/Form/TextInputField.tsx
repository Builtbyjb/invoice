import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TextInputFieldProps = {
  field: any;
  id: string;
  label: string;
  placeholder: string;
  isRequired?: boolean;
};

export default function TextInputField({ field, id, label, placeholder, isRequired = true }: TextInputFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>
        {label} {isRequired && <p className="text-destructive pb-0 mb-0">*</p>}
      </FieldLabel>
      <Input
        required={isRequired}
        id={id}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
