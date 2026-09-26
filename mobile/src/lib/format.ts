import { format, formatDistanceToNowStrict } from 'date-fns';

const currencyFormatters = new Map<string, Intl.NumberFormat | null>();

function currencyFormatter(code: string): Intl.NumberFormat | null {
  if (currencyFormatters.has(code)) return currencyFormatters.get(code) ?? null;
  let formatter: Intl.NumberFormat | null = null;
  for (const currencyDisplay of ['narrowSymbol', 'symbol'] as const) {
    try {
      formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: code, currencyDisplay });
      formatter.format(0);
      break;
    } catch {
      formatter = null;
    }
  }
  currencyFormatters.set(code, formatter);
  return formatter;
}

/** Port of SwiftUI `.currency(code:)` formatting. */
export function formatCurrency(value: number, code: string): string {
  const formatter = currencyFormatter(code);
  if (formatter) {
    try {
      return formatter.format(value);
    } catch {
      // fall through
    }
  }
  return `${code} ${value.toFixed(2)}`;
}

/** Swift `%.1f`, e.g. "Discount (5.0%)". */
export const formatPercent1 = (v: number): string => v.toFixed(1);

export const formatQty = (v: number): string => v.toFixed(1);

/** "Sep 26, 2026" (Swift `.abbreviated` / PDF `.medium`). */
export const formatDateAbbrev = (d: Date): string => format(d, 'MMM d, yyyy');

/** "September 26, 2026" (Swift `Text(date, style: .date)`). */
export const formatDateLong = (d: Date): string => format(d, 'MMMM d, yyyy');

/** "2 hours ago" (notification rows). */
export const formatRelative = (d: Date): string => formatDistanceToNowStrict(d, { addSuffix: true });

/** ISO-8601 without fractional seconds, e.g. 2026-09-26T16:25:00Z. */
export const toApiDate = (d: Date): string => d.toISOString().replace(/\.\d{3}Z$/, 'Z');

/** Port of CreateInvoiceView.decimalText: '' for 0, integer string if whole, else String(n). */
export function decimalText(n: number): string {
  if (n === 0 || !Number.isFinite(n)) return '';
  // JS already prints whole numbers without a fractional part ("5", not "5.0").
  return String(n);
}
