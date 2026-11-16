import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SelectData } from "@/lib/types";

type SelectFieldProps = {
  field: any;
  data: SelectData[];
  id: string;
  label: string;
  shouldLabel?: boolean;
  isRequired?: boolean;
};

export default function SelectField({
  field,
  id,
  label,
  data,
  shouldLabel = true,
  isRequired = true,
}: SelectFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      {shouldLabel && (
        <FieldLabel htmlFor={id}>
          {label} {isRequired && <p className="text-destructive pb-0 mb-0">*</p>}
        </FieldLabel>
      )}
      <Select
        id={id}
        required={isRequired}
        name={field.name}
        value={field.state.value}
        onValueChange={(e) => {
          if (e) field.handleChange(e);
        }}
      >
        <SelectTrigger id={id} aria-invalid={isInvalid}>
          <SelectValue>{data.find((c) => c.value === field.state.value)?.label || label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {data.map((d: SelectData) => (
            <SelectItem key={d.label} value={d.value}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
