import { decimalText, formatCurrency, formatDateAbbrev, formatDateLong, formatPercent1, toApiDate } from '../format';

describe('toApiDate', () => {
  it('omits fractional seconds', () => {
    expect(toApiDate(new Date('2026-09-26T16:25:00.123Z'))).toBe('2026-09-26T16:25:00Z');
    expect(toApiDate(new Date(Date.UTC(2026, 0, 1)))).toBe('2026-01-01T00:00:00Z');
  });
});

describe('decimalText', () => {
  it.each([
    [0, ''],
    [5, '5'],
    [10, '10'],
    [2.5, '2.5'],
    [49000.99, '49000.99'],
  ])('%p → %p', (n, expected) => {
    expect(decimalText(n)).toBe(expected);
  });
});

describe('formatCurrency', () => {
  it('formats with a currency symbol', () => {
    expect(formatCurrency(1500, 'USD')).toMatch(/\$1,500\.00/);
  });

  it('falls back to "CODE 0.00" for invalid currency codes', () => {
    expect(formatCurrency(12.5, 'NOT-A-CODE')).toBe('NOT-A-CODE 12.50');
  });
});

describe('dates and percents', () => {
  const d = new Date(2026, 8, 26);
  it('formats dates like Swift', () => {
    expect(formatDateAbbrev(d)).toBe('Sep 26, 2026');
    expect(formatDateLong(d)).toBe('September 26, 2026');
  });

  it('formats percents with one decimal', () => {
    expect(formatPercent1(5)).toBe('5.0');
  });
});
