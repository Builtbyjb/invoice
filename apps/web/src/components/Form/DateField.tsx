import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

type DateFieldProps = {
  field: any;
  label: string;
  id: string;
  shouldLabel?: boolean;
  isRequired?: boolean;
}

export default function DateField({ field, id, label, shouldLabel = true }: DateFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      {shouldLabel && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Popover>
        <PopoverTrigger
          id={id}
          className="flex border border-border items-center px-2 py-1 w-44 rounded-lg m-0 justify-between data-[empty=true]:text-muted-foreground"
        >
          {format(field.state.value, "PPP")}
          <ChevronDownIcon />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={(e) => {
              if (e) field.handleChange(e);
            }}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
