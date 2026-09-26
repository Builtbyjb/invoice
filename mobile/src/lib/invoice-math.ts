type Line = { quantity: number; price: number };

export const lineTotal = (item: Line): number => item.quantity * item.price;

export type Totals = {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
};

/** Port of Invoice.subtotal/discountAmount/taxAmount/grandTotal. Tax applies AFTER the discount. */
export function computeTotals(items: readonly Line[], discountPct: number, taxPct: number): Totals {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const discountAmount = subtotal * (discountPct / 100);
  const taxAmount = (subtotal - discountAmount) * (taxPct / 100);
  return { subtotal, discountAmount, taxAmount, grandTotal: subtotal - discountAmount + taxAmount };
}

/** Swift `Double(text) ?? 0`: invalid or empty numeric text counts as 0. */
export function parseDecimal(text: string): number {
  const trimmed = text.trim();
  if (trimmed === '' || !/^\d*\.?\d*$/.test(trimmed) || trimmed === '.') return 0;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : 0;
}
