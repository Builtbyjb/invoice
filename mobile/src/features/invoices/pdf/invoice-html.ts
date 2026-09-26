import { lightColors } from '@/constants/theme';
import { formatCurrency, formatDateAbbrev, formatPercent1, formatQty } from '@/lib/format';
import { computeTotals, lineTotal } from '@/lib/invoice-math';
import { fitTransform, parseSignature, strokesBounds, strokeToPath } from '@/lib/signature';
import type { Invoice } from '@/schemas/invoice';

/** Escapes user-provided text for HTML (`& < > " '`). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const e = escapeHtml;

// Printed on paper: always use the light palette (UIColor.label etc. in a PDF context).
const C = {
  label: '#000000',
  secondary: lightColors.secondaryLabel,
  blue: '#007AFF',
  gray: '#8E8E93',
  gray3: '#C7C7CC',
  gray4: '#D1D1D6',
  gray5: '#E5E5EA',
  gray6: '#F2F2F7',
};

const SIGNATURE_W = 200;
const SIGNATURE_H = 80;

function signatureSvg(signature: string | null | undefined): string {
  const strokes = parseSignature(signature);
  const bounds = strokesBounds(strokes);
  if (!bounds) return '';
  const t = fitTransform(bounds, SIGNATURE_W, SIGNATURE_H, 10);
  const paths = strokes
    .filter((s) => s.points.length > 0)
    .map((s) => `<path d="${strokeToPath(s.points, t)}" />`)
    .join('');
  return `<svg width="${SIGNATURE_W}" height="${SIGNATURE_H}" viewBox="0 0 ${SIGNATURE_W} ${SIGNATURE_H}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${C.label}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

/** Port of InvoicePDFGenerator as HTML for expo-print (US Letter, 50pt margins). */
export function buildInvoiceHtml(invoice: Invoice): string {
  const cur = invoice.currency;
  const money = (v: number) => e(formatCurrency(v, cur));
  const totals = computeTotals(invoice.items, invoice.discount, invoice.taxRate);
  const info = invoice.clientInfo;
  const addressLine = [info.address, info.city, info.country].filter((s) => s.trim() !== '').join(', ');
  const signature = signatureSvg(invoice.signature);

  const rows = invoice.items
    .map(
      (item, i) => `
        <tr class="${i % 2 === 1 ? 'alt' : ''}">
          <td class="desc">${e(item.description)}</td>
          <td class="num">${formatQty(item.quantity)}</td>
          <td class="num">${e(item.unit)}</td>
          <td class="num">${money(item.price)}</td>
          <td class="num">${money(lineTotal(item))}</td>
        </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${e(invoice.invoiceNumber)}</title>
<style>
  @page { size: 612pt 792pt; margin: 50pt; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: ${C.label}; font-size: 11pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; }
  .brand { display: flex; align-items: flex-start; gap: 12pt; }
  .logo { width: 48pt; height: 48pt; border-radius: 8pt; background: ${C.gray5}; border: 1px solid ${C.gray3}; display: flex; align-items: center; justify-content: center; font-size: 10pt; font-weight: 700; color: ${C.gray}; flex-shrink: 0; }
  .business { font-size: 20pt; font-weight: 700; margin-top: 4pt; }
  .title { text-align: right; }
  .title .label { font-size: 28pt; font-weight: 800; color: ${C.blue}; line-height: 1.1; }
  .title .number { font-size: 12pt; font-weight: 500; color: ${C.secondary}; margin-top: 4pt; }
  .section { margin-top: 20pt; }
  .meta { display: flex; }
  .meta > div { flex: 1; }
  .caption { font-size: 10pt; font-weight: 600; color: ${C.secondary}; }
  .meta .value { font-size: 12pt; font-weight: 500; margin-top: 2pt; }
  .client .name { font-size: 13pt; font-weight: 700; margin-top: 4pt; }
  .client .line { font-size: 12pt; margin-top: 2pt; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th { height: 32pt; background: ${C.gray6}; font-size: 11pt; font-weight: 600; color: ${C.secondary}; text-align: left; padding: 0 6pt; }
  th.num { text-align: right; }
  td { height: 28pt; font-size: 11pt; padding: 0 6pt; border-bottom: 1px solid ${C.gray4}; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  td.num { text-align: right; }
  tr.alt td { background: rgba(242,242,247,0.3); }
  .summary { width: 200pt; margin-left: auto; }
  .summary .row { display: flex; justify-content: space-between; height: 20pt; align-items: center; font-size: 11pt; }
  .summary .row .k { color: ${C.secondary}; }
  .summary .total { border-top: 1.5pt solid ${C.label}; margin-top: 4pt; }
  .summary .total .v { font-size: 12pt; font-weight: 700; }
  .notes { font-size: 11pt; max-height: 60pt; overflow: hidden; margin-top: 4pt; white-space: pre-wrap; }
  .signature { width: ${SIGNATURE_W}pt; height: ${SIGNATURE_H}pt; background: ${C.gray5}; border: 1px solid ${C.gray3}; margin-top: 4pt; }
  .signature svg { width: 100%; height: 100%; display: block; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="logo">LOGO</div>
      <div class="business">Your Business Name</div>
    </div>
    <div class="title">
      <div class="label">INVOICE</div>
      <div class="number">${e(invoice.invoiceNumber)}</div>
    </div>
  </div>

  <div class="section meta">
    <div><div class="caption">Status</div><div class="value">${e(invoice.status)}</div></div>
    <div><div class="caption">Issue Date</div><div class="value">${e(formatDateAbbrev(invoice.issueDate))}</div></div>
    <div><div class="caption">Due Date</div><div class="value">${e(formatDateAbbrev(invoice.dueDate))}</div></div>
  </div>

  <div class="section client">
    <div class="caption">Billed To</div>
    <div class="name">${e(invoice.clientName)}</div>
    ${info.email ? `<div class="line">${e(info.email)}</div>` : ''}
    ${info.phone ? `<div class="line">${e(info.phone)}</div>` : ''}
    ${addressLine ? `<div class="line">${e(addressLine)}</div>` : ''}
  </div>

  <table class="section">
    <colgroup>
      <col style="width:45%" /><col style="width:15%" /><col style="width:12%" /><col style="width:14%" /><col style="width:14%" />
    </colgroup>
    <thead>
      <tr><th>Description</th><th class="num">Qty</th><th class="num">Unit</th><th class="num">Price</th><th class="num">Total</th></tr>
    </thead>
    <tbody>${rows}
    </tbody>
  </table>

  <div class="section summary">
    <div class="row"><span class="k">Subtotal</span><span class="v">${money(totals.subtotal)}</span></div>
    <div class="row"><span class="k">Discount (${formatPercent1(invoice.discount)}%)</span><span class="v">${money(totals.discountAmount)}</span></div>
    <div class="row"><span class="k">Tax (${formatPercent1(invoice.taxRate)}%)</span><span class="v">${money(totals.taxAmount)}</span></div>
    <div class="row total"><span class="k">Grand Total</span><span class="v">${money(totals.grandTotal)}</span></div>
  </div>

  ${
    invoice.notes !== ''
      ? `<div class="section"><div class="caption">Notes</div><div class="notes">${e(invoice.notes)}</div></div>`
      : ''
  }

  ${signature ? `<div class="section"><div class="caption">Signature</div><div class="signature">${signature}</div></div>` : ''}
</body>
</html>`;
}
