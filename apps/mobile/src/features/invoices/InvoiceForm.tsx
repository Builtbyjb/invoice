import { useForm, useStore, type AnyFieldApi } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { DateField } from '../../components/fields/DateField';
import { firstError, useFieldError } from '../../components/fields/errors';
import { FieldError } from '../../components/fields/FieldError';
import { SelectField } from '../../components/fields/SelectField';
import { useSchemaValid } from '../../components/fields/useSchemaValid';
import { FormRow, FormSection } from '../../components/FormSection';
import { HeaderIconButton } from '../../components/HeaderIconButton';
import { Icon } from '../../components/Icon';
import { toOptions } from '../../components/SelectSheet';
import { Text } from '../../components/Text';
import { currencies } from '../../constants/currencies';
import { useTheme } from '../../constants/theme';
import { ClientFormSheet } from '../clients/ClientFormSheet';
import { errorMessage } from '../../lib/api/errors';
import { toInvoiceRequest } from '../../lib/api/invoices';
import { formatCurrency } from '../../lib/format';
import { computeTotals, lineTotal, parseDecimal } from '../../lib/invoice-math';
import { qk } from '../../lib/query/keys';
import {
  INVOICE_STATUSES,
  invoiceFormSchema,
  type Invoice,
  type InvoiceClient,
  type InvoiceFormValues,
} from '../../schemas/invoice';

import { ClientSearchField } from './ClientSearchField';
import { newLineItem, toInvoiceFormValues } from './form-values';
import { useCreateInvoice, useUpdateInvoice } from './hooks';
import { SignatureCanvas } from './SignatureCanvas';

export type InvoiceFormMode = { type: 'create' } | { type: 'edit'; invoice: Invoice };

const statusOptions = toOptions(INVOICE_STATUSES, (s) => s.charAt(0).toUpperCase() + s.slice(1));
const currencyOptions = toOptions(currencies);

function useInvoiceForm(mode: InvoiceFormMode, preferredCurrency: string) {
  const queryClient = useQueryClient();
  const create = useCreateInvoice();
  const update = useUpdateInvoice();

  // Computed once: `new Date()` would otherwise change on every render and reset the form.
  const [defaultValues] = useState<InvoiceFormValues>(() =>
    toInvoiceFormValues(mode.type === 'edit' ? mode.invoice : null, preferredCurrency),
  );

  return useForm({
    defaultValues,
    validators: { onChange: invoiceFormSchema, onSubmit: invoiceFormSchema },
    onSubmit: async ({ value }) => {
      const v = invoiceFormSchema.parse(value);
      // Always the currently selected client (Swift sent the original clientID on edit, §6 #10).
      const req = toInvoiceRequest(v, v.client!.id);
      try {
        if (mode.type === 'create') {
          const created = await create.mutateAsync(req);
          router.replace({ pathname: '/invoices/[id]', params: { id: created.id } });
        } else {
          const updated = await update.mutateAsync({ id: mode.invoice.id, req });
          queryClient.setQueryData(qk.invoices.detail(updated.id), updated);
          router.back();
        }
      } catch (e) {
        Alert.alert('Save Failed', errorMessage(e), [{ text: 'OK', style: 'cancel' }]);
      }
    },
  });
}

type InvoiceFormApi = ReturnType<typeof useInvoiceForm>;

type Props = { mode: InvoiceFormMode; preferredCurrency: string };

/** Port of CreateInvoiceView (create and edit). */
export function InvoiceForm({ mode, preferredCurrency }: Props) {
  const { colors } = useTheme();
  const form = useInvoiceForm(mode, preferredCurrency);
  const isValid = useSchemaValid(form, invoiceFormSchema);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <>
      <Stack.Screen
        options={{
          title: mode.type === 'create' ? 'New Invoice' : 'Edit Invoice',
          headerBackVisible: false,
          gestureEnabled: false,
          headerLeft: () => (
            <HeaderIconButton sf="xmark" accessibilityLabel="Cancel" testID="invoice-form-cancel" onPress={() => router.back()} />
          ),
          headerRight: () => (
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <HeaderIconButton
                  sf="checkmark"
                  accessibilityLabel="Save"
                  testID="invoice-form-save"
                  color={colors.blue}
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  onPress={() => form.handleSubmit()}
                />
              )}
            </form.Subscribe>
          ),
        }}
      />
      <KeyboardAwareScrollView
        testID="invoice-form"
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colors.groupedBackground }}
        contentContainerStyle={{ paddingBottom: 48 }}
        bottomOffset={24}
      >
        <InfoSection form={form} startWithSearch={mode.type === 'create'} />
        <LineItemsSection form={form} />
        <SummarySection form={form} />
        <SignatureSection form={form} onDrawingChange={(drawing) => setScrollEnabled(!drawing)} />
        <FormSection header="Notes">
          <form.Field name="notes">
            {(field) => (
              <TextInput
                testID="invoice-notes"
                accessibilityLabel="Notes"
                multiline
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                style={{ minHeight: 80, padding: 16, fontSize: 17, color: colors.label, textAlignVertical: 'top' }}
              />
            )}
          </form.Field>
        </FormSection>
      </KeyboardAwareScrollView>
    </>
  );
}

function RequiredHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      <Text variant="footnote" secondary style={{ textTransform: 'uppercase' }}>
        {title}
      </Text>
      <Text variant="footnote" color={colors.red}>
        *
      </Text>
    </View>
  );
}

function InfoSection({ form, startWithSearch }: { form: InvoiceFormApi; startWithSearch: boolean }) {
  return (
    <FormSection header="Invoice Information">
      <form.Field name="client">{(field) => <ClientRow field={field} startWithSearch={startWithSearch} />}</form.Field>
      <form.Field name="status">
        {(field) => (
          <SelectField
            title="Status"
            options={statusOptions}
            value={field.state.value}
            onChange={field.handleChange}
            testID="invoice-status"
          />
        )}
      </form.Field>
      <form.Field name="currency">
        {(field) => (
          <SelectField
            title="Currency"
            options={currencyOptions}
            value={field.state.value}
            onChange={field.handleChange}
            searchable
            testID="invoice-currency"
          />
        )}
      </form.Field>
      <form.Field name="issueDate">
        {(field) => <DateField label="Issue Date" value={field.state.value} onChange={field.handleChange} testID="invoice-issue-date" />}
      </form.Field>
      <form.Field name="dueDate">{(field) => <DueDateField field={field} />}</form.Field>
    </FormSection>
  );
}

function DueDateField({ field }: { field: AnyFieldApi }) {
  const submitted = useStore(field.form.store, (s) => s.submissionAttempts > 0);
  // Dates have no blur: show the error as soon as the value was changed.
  const error = field.state.meta.isDirty || submitted ? firstError(field.state.meta.errors) : undefined;
  return (
    <DateField
      label="Due Date"
      value={field.state.value as Date}
      onChange={field.handleChange}
      error={error}
      testID="invoice-due-date"
    />
  );
}

function ClientRow({ field, startWithSearch }: { field: AnyFieldApi; startWithSearch: boolean }) {
  const { colors } = useTheme();
  const client = field.state.value as InvoiceClient | null;
  const [showSearch, setShowSearch] = useState(startWithSearch || client === null);
  const [showCreate, setShowCreate] = useState(false);
  const submitted = useStore(field.form.store, (s) => s.submissionAttempts > 0);
  const error = submitted ? firstError(field.state.meta.errors) : undefined;

  const select = (c: InvoiceClient | null) => {
    field.handleChange(c);
    field.handleBlur();
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 30 }}>
          <Text>Client</Text>
          <Text color={colors.red}>*</Text>
          <Pressable
            testID="invoice-create-client"
            accessibilityRole="button"
            accessibilityLabel="New client"
            hitSlop={8}
            onPress={() => setShowCreate(true)}
            style={{ marginLeft: 4 }}
          >
            <Icon sf="plus.circle" size={20} color={colors.blue} />
          </Pressable>
        </View>
        <View style={{ flex: 1, marginLeft: 8, justifyContent: 'center', minHeight: 30 }}>
          {showSearch || client === null ? (
            <ClientSearchField selection={client} onSelect={select} />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
              <Text numberOfLines={1} style={{ flexShrink: 1 }} testID="invoice-client-name">
                {client.name}
              </Text>
              <Pressable
                testID="invoice-client-clear"
                accessibilityRole="button"
                accessibilityLabel="Change client"
                hitSlop={8}
                onPress={() => {
                  select(null);
                  setShowSearch(true);
                }}
              >
                <Icon sf="xmark.circle.fill" size={17} color={colors.secondaryLabel} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <FieldError message={error} />
      <ClientFormSheet
        visible={showCreate}
        mode={{ type: 'create' }}
        onClose={() => setShowCreate(false)}
        onSaved={(c) => select({ id: c.id, name: c.name, email: c.email })}
      />
    </View>
  );
}

function LineItemsSection({ form }: { form: InvoiceFormApi }) {
  const { colors } = useTheme();
  return (
    <form.Field name="items" mode="array">
      {(itemsField) => (
        <View>
          <FormSection header={<RequiredHeader title="Line Items" />}>
            {[
              ...itemsField.state.value.map((item, i) => (
                <LineItemRow key={item.id} form={form} index={i} onRemove={() => itemsField.removeValue(i)} />
              )),
              <Pressable
                key="add"
                testID="invoice-add-item"
                accessibilityRole="button"
                onPress={() => itemsField.pushValue(newLineItem())}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: 44,
                  paddingHorizontal: 16,
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Icon sf="plus.circle" size={18} color={colors.blue} />
                <Text color={colors.blue}>Item</Text>
              </Pressable>,
            ]}
          </FormSection>
          <ItemsError form={form} />
        </View>
      )}
    </form.Field>
  );
}

function ItemsError({ form }: { form: InvoiceFormApi }) {
  const submitted = useStore(form.store, (s) => s.submissionAttempts > 0);
  const errors = useStore(form.store, (s) => s.fieldMeta.items?.errors ?? []);
  if (!submitted) return null;
  return (
    <View style={{ marginHorizontal: 32 }}>
      <FieldError message={firstError(errors)} testID="invoice-items-error" />
    </View>
  );
}

function InlineInput({
  field,
  label,
  placeholder,
  decimal,
  testID,
}: {
  field: AnyFieldApi;
  label?: string;
  placeholder?: string;
  decimal?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const error = useFieldError(field);
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {label ? <Text secondary>{label}</Text> : null}
        <TextInput
          testID={testID}
          accessibilityLabel={label ?? placeholder}
          value={field.state.value as string}
          onChangeText={field.handleChange}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.tertiaryLabel}
          keyboardType={decimal ? 'decimal-pad' : 'default'}
          style={{ flex: 1, fontSize: 17, color: colors.label, paddingVertical: 2 }}
        />
      </View>
      <FieldError message={error} />
    </View>
  );
}

function LineItemRow({ form, index, onRemove }: { form: InvoiceFormApi; index: number; onRemove: () => void }) {
  const { colors } = useTheme();
  const currency = useStore(form.store, (s) => s.values.currency);
  const item = useStore(form.store, (s) => s.values.items[index]);
  const total = item ? lineTotal({ quantity: parseDecimal(item.quantity), price: parseDecimal(item.price) }) : 0;

  return (
    <View testID={`invoice-item-${index}`}>
      <FormRow style={{ gap: 12 }}>
        <form.Field name={`items[${index}].description`}>
          {(field) => <InlineInput field={field} placeholder="Description" testID={`item-${index}-description`} />}
        </form.Field>
        <form.Field name={`items[${index}].quantity`}>
          {(field) => <InlineInput field={field} label="Quantity:" placeholder="0.00" decimal testID={`item-${index}-quantity`} />}
        </form.Field>
        <form.Field name={`items[${index}].unit`}>
          {(field) => <InlineInput field={field} label="Unit:" testID={`item-${index}-unit`} />}
        </form.Field>
        <form.Field name={`items[${index}].price`}>
          {(field) => <InlineInput field={field} label="Price:" placeholder="0.00" decimal testID={`item-${index}-price`} />}
        </form.Field>
      </FormRow>
      <View style={{ height: 0.5, backgroundColor: colors.separator, marginLeft: 16 }} />
      <FormRow style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="headline" testID={`item-${index}-total`}>
          Total: {formatCurrency(total, currency)}
        </Text>
        <Pressable
          testID={`item-${index}-remove`}
          accessibilityRole="button"
          accessibilityLabel="Remove item"
          hitSlop={8}
          onPress={onRemove}
        >
          <Icon sf="trash" size={18} color={colors.red} />
        </Pressable>
      </FormRow>
    </View>
  );
}

function PercentRow({
  form,
  name,
  label,
  amount,
  currency,
}: {
  form: InvoiceFormApi;
  name: 'discount' | 'tax';
  label: string;
  amount: number;
  currency: string;
}) {
  return (
    <FormRow style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text secondary>{label}</Text>
        <form.Field name={name}>
          {(field) => <InlineInput field={field} placeholder="0" decimal testID={`invoice-${name}`} />}
        </form.Field>
      </View>
      <Text testID={`invoice-${name}-amount`}>{formatCurrency(amount, currency)}</Text>
    </FormRow>
  );
}

function SummarySection({ form }: { form: InvoiceFormApi }) {
  const items = useStore(form.store, (s) => s.values.items);
  const discount = useStore(form.store, (s) => s.values.discount);
  const tax = useStore(form.store, (s) => s.values.tax);
  const currency = useStore(form.store, (s) => s.values.currency);

  // Invalid numeric text counts as 0 in the live totals (Swift `Double(text) ?? 0`).
  const totals = computeTotals(
    items.map((i) => ({ quantity: parseDecimal(i.quantity), price: parseDecimal(i.price) })),
    parseDecimal(discount),
    parseDecimal(tax),
  );

  return (
    <FormSection header="Summary">
      <FormRow style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text secondary>Subtotal</Text>
        <Text testID="invoice-subtotal">{formatCurrency(totals.subtotal, currency)}</Text>
      </FormRow>
      <PercentRow form={form} name="discount" label="Discount (%)" amount={totals.discountAmount} currency={currency} />
      <PercentRow form={form} name="tax" label="Tax (%)" amount={totals.taxAmount} currency={currency} />
      <FormRow style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="headline">Grand Total</Text>
        <Text variant="headline" testID="invoice-grand-total">
          {formatCurrency(totals.grandTotal, currency)}
        </Text>
      </FormRow>
    </FormSection>
  );
}

function SignatureSection({ form, onDrawingChange }: { form: InvoiceFormApi; onDrawingChange: (d: boolean) => void }) {
  const { colors } = useTheme();
  return (
    <form.Field name="signature">
      {(field) => (
        <FormSection header="Signature">
          {[
            <FormRow key="canvas">
              <SignatureCanvas
                testID="invoice-signature"
                strokes={field.state.value}
                onChange={field.handleChange}
                height={140}
                onDrawingChange={onDrawingChange}
              />
            </FormRow>,
            ...(field.state.value.length > 0
              ? [
                  <Pressable
                    key="clear"
                    testID="invoice-signature-clear"
                    accessibilityRole="button"
                    onPress={() => field.handleChange([])}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      minHeight: 44,
                      paddingHorizontal: 16,
                      opacity: pressed ? 0.5 : 1,
                    })}
                  >
                    <Icon sf="eraser" size={17} color={colors.red} />
                    <Text color={colors.red}>Clear</Text>
                  </Pressable>,
                ]
              : []),
          ]}
        </FormSection>
      )}
    </form.Field>
  );
}
