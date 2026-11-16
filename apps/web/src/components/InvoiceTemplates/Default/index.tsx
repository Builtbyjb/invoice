import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { Client } from "@/lib/types";
import type { Invoice, InvoiceItem } from "@shared/lib/types";
import { formatCurrency } from "@/lib/utils";
import { calculateDiscount, calculateSubTotal, calculateTaxAmount, calculateTotalAmount } from "@shared/utils/util";
import { APP_NAME } from "@/lib/constant";
import { STYLE } from "./style";

function TableRow({ item, currency }: { item: InvoiceItem; currency: string }) {
  return (
    <View style={STYLE.tableRow}>
      <Text style={[STYLE.tableRowText, STYLE.colDesc]}>{item.description}</Text>
      <Text style={[STYLE.tableRowText, STYLE.colQty]}>{item.quantity}</Text>
      <Text style={[STYLE.tableRowText, STYLE.colUnit]}>{formatCurrency(item.unitPrice, currency)}</Text>
      <Text style={[STYLE.tableRowText, STYLE.colAmount]}>
        {formatCurrency(item.quantity * item.unitPrice, currency)}
      </Text>
    </View>
  );
}

function TotalsRow({ label, value, final = false }: { label: string; value: string; final?: boolean }) {
  if (final) {
    return (
      <View style={STYLE.totalsFinalRow}>
        <Text style={STYLE.totalsFinalLabel}>{label}</Text>
        <Text style={STYLE.totalsFinalValue}>{value}</Text>
      </View>
    );
  }
  return (
    <View style={STYLE.totalsRow}>
      <Text style={STYLE.totalsLabel}>{label}</Text>
      <Text style={STYLE.totalsValue}>{value}</Text>
    </View>
  );
}

type Props = {
  invoice: Invoice;
  client: Client | null;
  bussinessname?: string;
  logoURL?: string;
  signature?: string;
};

export function DefaultInvoicePDF({ invoice, client, bussinessname, logoURL, signature }: Props) {
  const subtotal = calculateSubTotal(invoice.items);

  return (
    <Document>
      <Page size="A4" style={STYLE.page}>
        {/* ---- Header ---- */}
        <View style={STYLE.header}>
          <View style={STYLE.column}>
            {logoURL && <Image style={STYLE.logo} src={logoURL} />}
            {bussinessname && <Text style={STYLE.businessName}>{bussinessname}</Text>}
          </View>
          <View style={STYLE.column}>
            <Text style={STYLE.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            <Text style={STYLE.headerMeta}>Issue: {format(new Date(invoice.issueDate), "MMM d, yyyy")}</Text>
            <Text style={STYLE.headerMeta}>Due: {format(new Date(invoice.dueDate), "MMM d, yyyy")}</Text>
          </View>
        </View>

        {/* ---- Bill To ---- */}
        {client && (
          <View style={STYLE.billToBox}>
            <Text style={STYLE.sectionLabel}>Bill To</Text>
            <Text style={STYLE.clientName}>{client.name}</Text>
            {/*<Text style={STYLE.clientMeta}>{client.email}</Text>
            {client.phone && <Text style={STYLE.clientMeta}>{client.phone}</Text>}*/}
            {client.address && <Text style={STYLE.clientMeta}>{client.address}</Text>}
            <Text style={STYLE.clientMeta}>
              {client.city}, {client.country}
            </Text>
          </View>
        )}

        {/* ---- Items Table ---- */}
        <View>
          {/* Table header */}
          <View style={STYLE.tableHeader}>
            <Text style={[STYLE.tableHeaderText, STYLE.colDesc]}>Description</Text>
            <Text style={[STYLE.tableHeaderText, STYLE.colQty]}>Qty</Text>
            <Text style={[STYLE.tableHeaderText, STYLE.colUnit]}>Unit</Text>
            <Text style={[STYLE.tableHeaderText, STYLE.colAmount]}>Amount</Text>
          </View>

          {/* Table rows */}
          {invoice.items.map((item: InvoiceItem, index: number) => (
            <TableRow key={index} item={item} currency={invoice.currency} />
          ))}
        </View>

        {/* ---- Totals ---- */}
        <View style={STYLE.totalsWrapper}>
          <View style={STYLE.totalsBox}>
            <TotalsRow label="Subtotal" value={formatCurrency(subtotal, invoice.currency)} />
            <TotalsRow
              label={`Discount (${invoice.discount}%)`}
              value={formatCurrency(calculateDiscount(subtotal, invoice.discount), invoice.currency)}
            />
            <TotalsRow
              label={`Tax (${invoice.taxRate}%)`}
              value={formatCurrency(calculateTaxAmount(subtotal, invoice.taxRate), invoice.currency)}
            />
            <TotalsRow
              final
              label="Total"
              value={formatCurrency(
                calculateTotalAmount(invoice.items, invoice.taxRate, invoice.discount),
                invoice.currency,
              )}
            />
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={STYLE.notesWrapper}>
            <Text style={STYLE.sectionLabel}>Notes</Text>
            <Text style={STYLE.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={STYLE.signaturesWrapper}>
          <Text style={STYLE.sectionLabel}>Signatures</Text>
          <View style={STYLE.signaturesGrid}>
            {/* Business signature */}
            <View style={STYLE.signatureBlock}>
              {signature && <Image style={STYLE.signatureImage} src={signature} />}
              <Text style={STYLE.signatureLine}>{bussinessname}</Text>
            </View>

            {/* Client signature placeholder */}
            <View style={STYLE.signatureBlock}>
              <View style={{ height: 48 }} />
              <Text style={STYLE.signatureLine}>{client?.name}</Text>
            </View>
          </View>

          <Text style={STYLE.footer}>Thank you for your business! | Generated by {APP_NAME}</Text>
        </View>
      </Page>
    </Document>
  );
}
