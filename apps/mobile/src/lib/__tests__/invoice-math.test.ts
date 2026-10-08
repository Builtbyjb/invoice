import { computeTotals, lineTotal, parseDecimal } from '../invoice-math';

describe('computeTotals', () => {
  it('matches the Swift formulas for a realistic invoice', () => {
    const items = [
      { quantity: 2, price: 49000.99 },
      { quantity: 2, price: 499.99 },
      { quantity: 2, price: 4900000.99 },
    ];
    const t = computeTotals(items, 5, 10);
    const subtotal = 2 * 49000.99 + 2 * 499.99 + 2 * 4900000.99;
    expect(t.subtotal).toBeCloseTo(subtotal, 6);
    expect(t.discountAmount).toBeCloseTo(subtotal * 0.05, 6);
    expect(t.taxAmount).toBeCloseTo((subtotal - subtotal * 0.05) * 0.1, 6);
    expect(t.grandTotal).toBeCloseTo(subtotal * 0.95 * 1.1, 6);
  });

  it('applies tax after the discount', () => {
    const t = computeTotals([{ quantity: 1, price: 100 }], 10, 10);
    expect(t).toEqual({ subtotal: 100, discountAmount: 10, taxAmount: 9, grandTotal: 99 });
  });

  it('returns zeros for no items', () => {
    expect(computeTotals([], 5, 10)).toEqual({ subtotal: 0, discountAmount: 0, taxAmount: 0, grandTotal: 0 });
  });

  it('lineTotal is quantity × price', () => {
    expect(lineTotal({ quantity: 2.5, price: 4 })).toBe(10);
  });
});

describe('parseDecimal', () => {
  it.each([
    ['', 0],
    ['12', 12],
    ['1.5', 1.5],
    ['.5', 0.5],
    ['abc', 0],
    ['1.2.3', 0],
    ['-3', 0],
    ['.', 0],
  ])('parses %p as %p', (input, expected) => {
    expect(parseDecimal(input)).toBe(expected);
  });
});
