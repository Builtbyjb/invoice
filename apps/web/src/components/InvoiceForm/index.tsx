import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Trash2, Mail, Phone } from "lucide-react";
import type { Client, SelectData } from "@/lib/types";
import type { Invoice, InvoiceStatus } from "@shared/lib/types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldLabel, FieldError, FieldContent, FieldTitle } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";
import { calculateTotalAmount, calculateTaxAmount, calculateDiscount, calculateSubTotal } from "@shared/utils/util";
import { Separator } from "@/components/ui/separator";
import { CURRENCIES } from "@/lib/constant";
import { useFetch } from "@/hooks/useFetch";
import NumberInput from "../Form/NumberInput";
import SelectField from "../Form/SelectField";
import DateField from "../Form/DateField";
import SignatureCanvas from "react-signature-canvas";
import { InvoiceFormSchema } from "@shared/lib/zod-schema";
import { useNavigate } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";

interface InvoiceFormProps {
  clientInfo: Client | null;
  existingInvoice?: Invoice | null;
  invoiceId?: string;
}

type InvoiceForm = z.infer<typeof InvoiceFormSchema>;

const status: SelectData[] = [
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
];

export default function InvoiceForm({ clientInfo, existingInvoice, invoiceId }: InvoiceFormProps) {
  const { doPOST, doPUT } = useFetch();
  const navigate = useNavigate();

  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (value: InvoiceForm) => {
    setIsSubmitting(true);
    try {
      if (!clientInfo) throw new Error("Client Id not found");

      // Get user signature
      const signature = sigCanvas.current?.toDataURL("image/png");

      const payload = { ...value, clientId: clientInfo.id, signature };

      const response = await doPOST(`/api/v1/invoice/clients/${clientInfo.id}/invoices/create`, payload);
      if (response instanceof Error) throw response;

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("Invoice created");
      form.reset();

      navigate({ to: `/clients/${clientInfo.id}/invoices/${result.data.id}` });
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (value: InvoiceForm) => {
    setIsSubmitting(true);
    try {
      if (!clientInfo) throw new Error("Client Id not found");
      if (!invoiceId) throw new Error("Invoice Id not found");

      // Get user signature
      const signature = sigCanvas.current?.toDataURL("image/png");

      const payload = { ...value, clientId: clientInfo.id, signature };

      const response = await doPUT(`/api/v1/invoice/clients/${clientInfo.id}/invoices/${invoiceId}/edit`, payload);
      if (response instanceof Error) throw response;

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("Invoice Edited");

      navigate({ to: `/clients/${clientInfo.id}/invoices/${result.data.id}` });
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm({
    defaultValues: {
      issueDate: new Date(),
      dueDate: new Date(),
      taxRate: 0,
      discount: 0,
      status: "draft" as InvoiceStatus,
      items: [
        {
          description: "",
          quantity: 0,
          unitPrice: 0,
        },
      ],
      currency: "",
      notes: "",
    },
    validators: {
      onSubmit: InvoiceFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!existingInvoice) await handleCreate(value);
      else await handleUpdate(value);
    },
  });

  useEffect(() => {
    /* Set default values for invoice update  */
    if (existingInvoice) {
      form.setFieldValue("issueDate", new Date(existingInvoice.issueDate));
      form.setFieldValue("dueDate", new Date(existingInvoice.dueDate));
      form.setFieldValue("status", existingInvoice.status);
      form.setFieldValue("items", existingInvoice.items);
      form.setFieldValue("taxRate", existingInvoice.taxRate);
      form.setFieldValue("discount", existingInvoice.discount);
      form.setFieldValue("items", existingInvoice.items);
      form.setFieldValue("notes", existingInvoice.notes);
      form.setFieldValue("currency", existingInvoice.currency);
      if (existingInvoice.signature) sigCanvas.current?.fromDataURL(existingInvoice.signature);
    }
  }, [existingInvoice, form]);

  return (
    <form
      id="create-invoice-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice details card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Select client */}
            <Field>
              <FieldContent>
                <h1 className="text-lg mb-4">{clientInfo?.name}</h1>
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm mt-0.5 whitespace-pre-line">{clientInfo?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm mt-0.5 whitespace-pre-line">{clientInfo?.phone}</p>
                    </div>
                  </div>
                </div>
              </FieldContent>
            </Field>
            <div className="flex gap-4 items-center">
              <form.Field
                name="status"
                children={(field) => {
                  return <SelectField field={field} id="select-status" label="Status" data={status} />;
                }}
              />
              <form.Field
                name="currency"
                children={(field) => {
                  return <SelectField field={field} id="select-currency" label="Currency" data={CURRENCIES} />;
                }}
              />
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Issue Date */}
              <form.Field
                name="issueDate"
                children={(field) => {
                  return <DateField field={field} id="issue-date-input" label="Issue Date" />;
                }}
              />
              {/* Due date */}
              <form.Field
                name="dueDate"
                children={(field) => {
                  return <DateField field={field} id="due-date-input" label="Due Date" />;
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary card */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Subscribe
              selector={(s) => calculateSubTotal(s.values.items)}
              children={(subtotal) => {
                return (
                  <div className="flex justify-between pt-4 border-t border-border">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                );
              }}
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Discount</span>
                {/* Discount Rate */}
                <form.Field
                  name="discount"
                  children={(field) => {
                    return (
                      <div className="w-16">
                        <NumberInput field={field} id="discount-input" label={field.name} shouldLabel={false} />
                      </div>
                    );
                  }}
                />
                <span className="text-muted-foreground">%</span>
              </div>
              {/* Discount amount */}
              <div>
                <form.Subscribe
                  selector={(s) => {
                    const subTotal = calculateSubTotal(s.values.items);
                    return calculateDiscount(subTotal, s.values.discount);
                  }}
                  children={(amount) => {
                    return (
                      <Field>
                        <FieldContent>
                          <span>{formatCurrency(amount)}</span>
                        </FieldContent>
                      </Field>
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tax</span>
                {/* Tax Rate */}
                <form.Field
                  name="taxRate"
                  children={(field) => {
                    return (
                      <div className="w-16">
                        <NumberInput field={field} id="tax-rate-input" label={field.name} shouldLabel={false} />
                      </div>
                    );
                  }}
                />
                <span className="text-muted-foreground">%</span>
              </div>
              {/* Tax amount */}
              <div>
                <form.Subscribe
                  selector={(s) => {
                    const subTotal = calculateSubTotal(s.values.items);
                    return calculateTaxAmount(subTotal, s.values.taxRate);
                  }}
                  children={(taxAmount) => {
                    return (
                      <Field>
                        <FieldContent>
                          <span>{formatCurrency(taxAmount)}</span>
                        </FieldContent>
                      </Field>
                    );
                  }}
                />
              </div>
            </div>
            {/* Total amount to pay */}
            <form.Subscribe
              selector={(s) => calculateTotalAmount(s.values.items, s.values.taxRate, s.values.discount)}
              children={(total) => {
                return (
                  <div className="flex justify-between pt-4 border-t border-border">
                    <div>
                      <FieldLabel>Total</FieldLabel>
                    </div>
                    <div>
                      <FieldContent>
                        <span className="font-medium">{formatCurrency(total)}</span>
                      </FieldContent>
                    </div>
                  </div>
                );
              }}
            />
          </CardContent>
        </Card>
      </div>
      {/* Line Items */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <form.Field name="items" mode="array">
              {(field) => (
                <div>
                  <FieldTitle className="text-lg mb-4">Line Items</FieldTitle>
                  {field.state.value.map((_, idx) => (
                    <div key={idx}>
                      {field.state.value.length > 1 && <Separator key={`s-${idx}`} className="mt-6 mb-6" />}
                      <Field key={idx} orientation="responsive" className="grid md:grid-cols-12 gap-4">
                        <form.Field
                          name={`items[${idx}].description`}
                          children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid} className="col-span-5">
                                <FieldLabel htmlFor={`line-item-description-${idx}`}>Description</FieldLabel>
                                <Input
                                  className="w-auto"
                                  required
                                  id={`line-item-description-${idx}`}
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  aria-invalid={isInvalid}
                                  placeholder="Item description"
                                  autoComplete="off"
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                              </Field>
                            );
                          }}
                        />
                        <form.Field
                          name={`items[${idx}].quantity`}
                          children={(field) => {
                            return (
                              <div className="col-span-2">
                                <NumberInput field={field} id={`line-item-quantity-${idx}`} label="Quantity" />
                              </div>
                            );
                          }}
                        />
                        <form.Field
                          name={`items[${idx}].unitPrice`}
                          children={(field) => {
                            return (
                              <div className="col-span-2">
                                <NumberInput field={field} id={`line-item-unit-price-${idx}`} label="Unit Price" />
                              </div>
                            );
                          }}
                        />
                        <form.Subscribe
                          selector={(s) => {
                            const item = s.values.items[idx];
                            if (item && item.quantity && item.unitPrice) return item.quantity * item.unitPrice;
                            else return 0;
                          }}
                          children={(total) => {
                            return (
                              <Field className="col-span-2">
                                <FieldLabel>Amount</FieldLabel>
                                <FieldContent>
                                  <span className="font-medium">{formatCurrency(total)}</span>
                                </FieldContent>
                              </Field>
                            );
                          }}
                        />
                        <Field className="col-span-1">
                          <FieldContent>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => field.removeValue(idx)}
                              disabled={field.state.value.length === 1}
                              className="h-9 w-9"
                            >
                              <Trash2 className="h-4 w-4 " />
                            </Button>
                          </FieldContent>
                        </Field>
                      </Field>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-8"
                    onClick={() => field.pushValue({ description: "", quantity: 0, unitPrice: 0 })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>
        <CardContent>
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            clearOnResize={false}
            canvasProps={{
              style: {
                backgroundColor: "#e5e7eb",
                width: "100%",
                height: "126px",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              },
              className: "sigCanvas",
            }}
          />
        </CardContent>
        <CardFooter className="bg-background">
          <Button
            variant="outline"
            onClick={() => {
              if (sigCanvas.current) sigCanvas.current.clear();
            }}
          >
            Clear
          </Button>
        </CardFooter>
      </Card>

      {/* Notes card */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <form.Field
            name="notes"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Textarea
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Additional notes or payment instructions..."
                    aria-invalid={isInvalid}
                    rows={4}
                  />
                </Field>
              );
            }}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
          Reset
        </Button>
        <Button type="submit" form="create-invoice-form" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="mr-2" aria-hidden="true" />}
          {isSubmitting ? (existingInvoice ? "Updating" : "Creating") : existingInvoice ? "Update" : "Create"} Invoice
        </Button>
      </div>
    </form>
  );
}
