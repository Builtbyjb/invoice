import { Fragment } from 'react';
import { ScrollView, View } from 'react-native';

import { statusColor } from '@/components/StatusBadge';
import { Text } from '@/components/Text';
import { lightCardShadow, radii, useTheme } from '@/constants/theme';
import { formatCurrency, formatDateAbbrev, formatPercent1, formatQty } from '@/lib/format';
import { computeTotals, lineTotal } from '@/lib/invoice-math';
import { parseSignature } from '@/lib/signature';
import type { Invoice } from '@/schemas/invoice';

import { SignatureCanvas } from './SignatureCanvas';

function DetailCard({ title, children }: { title?: string; children: React.ReactNode }) {
  const { colors, dark } = useTheme();
  return (
    <View
      style={[
        {
          padding: 16,
          gap: 12,
          borderRadius: radii.inner,
          backgroundColor: dark ? colors.secondaryBackground : colors.background,
        },
        lightCardShadow,
      ]}
    >
      {title ? (
        <Text variant="caption" weight="600" secondary style={{ textTransform: 'uppercase' }}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function Label({ children }: { children: string }) {
  return (
    <Text variant="caption" weight="600" secondary>
      {children}
    </Text>
  );
}

function SummaryRow({ label, value, total }: { label: string; value: string; total?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text variant={total ? 'headline' : 'subheadline'}>{label}</Text>
      <Text variant={total ? 'headline' : 'subheadline'} weight={total ? '700' : undefined}>
        {value}
      </Text>
    </View>
  );
}

/** Body of the invoice detail screen (port of InvoiceView). */
export function InvoiceDetail({ invoice }: { invoice: Invoice }) {
  const { colors } = useTheme();
  const currency = invoice.currency;
  const totals = computeTotals(invoice.items, invoice.discount, invoice.taxRate);
  const strokes = parseSignature(invoice.signature);
  const divider = <View style={{ height: 0.5, backgroundColor: colors.separator }} />;

  const meta = [
    { label: 'Status', value: invoice.status, color: statusColor(invoice.status, colors) },
    { label: 'Currency', value: currency },
    { label: 'Issue Date', value: formatDateAbbrev(invoice.issueDate) },
    { label: 'Due Date', value: formatDateAbbrev(invoice.dueDate) },
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, gap: 24 }}
    >
      <DetailCard title="Billed To">
        <View style={{ gap: 2 }}>
          <Text variant="headline">{invoice.clientName}</Text>
          {[invoice.clientInfo.email, invoice.clientInfo.address, invoice.clientInfo.city, invoice.clientInfo.country].map(
            (line, i) => (
              <Text key={i} variant="caption" secondary>
                {line}
              </Text>
            ),
          )}
        </View>
      </DetailCard>

      <DetailCard>
        <View style={{ flexDirection: 'row' }}>
          {meta.map((m, i) => (
            <Fragment key={m.label}>
              {i > 0 ? <View style={{ width: 0.5, backgroundColor: colors.separator }} /> : null}
              <View style={{ flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: 2 }}>
                <Text variant="caption" secondary align="center">
                  {m.label}
                </Text>
                <Text variant="caption" color={m.color} align="center">
                  {m.value}
                </Text>
              </View>
            </Fragment>
          ))}
        </View>
      </DetailCard>

      <DetailCard title="Items">
        <View style={{ gap: 8 }}>
          {invoice.items.map((item, i) => (
            <View key={item.id} style={{ gap: 4 }}>
              <Label>Description</Label>
              <Text>{item.description}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Label>Quantity:</Label>
                  <Text>
                    {formatQty(item.quantity)} {item.unit}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Label>Price:</Label>
                  <Text>{formatCurrency(item.price, currency)}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Label>Total:</Label>
                <Text>{formatCurrency(lineTotal(item), currency)}</Text>
              </View>
              {i < invoice.items.length - 1 ? <View style={{ marginTop: 4 }}>{divider}</View> : null}
            </View>
          ))}
        </View>
      </DetailCard>

      <DetailCard title="Summary">
        <View style={{ gap: 8 }}>
          <SummaryRow label="Subtotal" value={formatCurrency(totals.subtotal, currency)} />
          {invoice.discount > 0 ? (
            <SummaryRow
              label={`Discount (${formatPercent1(invoice.discount)}%)`}
              value={formatCurrency(-totals.discountAmount, currency)}
            />
          ) : null}
          {invoice.taxRate > 0 ? (
            <SummaryRow label={`Tax (${formatPercent1(invoice.taxRate)}%)`} value={formatCurrency(totals.taxAmount, currency)} />
          ) : null}
          {divider}
          <SummaryRow label="Grand Total" value={formatCurrency(totals.grandTotal, currency)} total />
        </View>
      </DetailCard>

      {invoice.notes !== '' ? (
        <DetailCard title="Notes">
          <Text variant="subheadline">{invoice.notes}</Text>
        </DetailCard>
      ) : null}

      {strokes.length > 0 ? (
        <DetailCard title="Signature">
          <SignatureCanvas strokes={strokes} readOnly height={120} testID="signature-readonly" />
        </DetailCard>
      ) : null}
    </ScrollView>
  );
}
