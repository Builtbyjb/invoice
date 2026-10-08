import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type NumberInputProps = {
  field: any;
  id: string;
  label: string;
  shouldLabel?: boolean;
};

export default function NumberInput({ field, id, label, shouldLabel = true }: NumberInputProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      {shouldLabel && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Input
        id={id}
        required
        type="number"
        step="any"
        onFocus={(e) => {
          if (Number(e.target.value) === 0) field.clearValues();
        }}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => {
          if (e.target.value.length === 0) {
            field.clearValues();
          } else {
            field.handleChange(Number(e.target.value));
          }
        }}
        aria-invalid={isInvalid}
        className="w-auto"
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
