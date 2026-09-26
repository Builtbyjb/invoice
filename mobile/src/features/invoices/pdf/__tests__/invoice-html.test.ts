import { demoInvoice } from '@/lib/demo-data';

import { pdfFileName } from '../generate';
import { buildInvoiceHtml, escapeHtml } from '../invoice-html';

jest.mock('expo-print', () => ({ printToFileAsync: jest.fn() }));
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn() }));
jest.mock('expo-file-system', () => ({ File: jest.fn(), Paths: {} }));

// Dates are formatted in local time; pin the zone so the snapshot is stable.
const originalTZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = 'UTC';
});
afterAll(() => {
  process.env.TZ = originalTZ;
});

describe('buildInvoiceHtml', () => {
  it('matches the snapshot for the demo invoice', () => {
    expect(buildInvoiceHtml(demoInvoice)).toMatchSnapshot();
  });

  it('escapes user-provided text', () => {
    const html = buildInvoiceHtml({
      ...demoInvoice,
      notes: '<script>alert("x")</script>',
      clientName: 'Tom & Jerry\'s',
      items: [{ id: '1', description: '<b>bold</b>', quantity: 1, unit: 'hr', price: 1 }],
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    expect(html).toContain('Tom &amp; Jerry&#39;s');
    expect(html).toContain('&lt;b&gt;bold&lt;/b&gt;');
  });

  it('uses the invoice currency, not USD', () => {
    const html = buildInvoiceHtml({ ...demoInvoice, currency: 'EUR' });
    expect(html).toContain('€');
    expect(html).not.toContain('$');
  });

  it('renders Billed To with email, phone and address', () => {
    const html = buildInvoiceHtml(demoInvoice);
    expect(html).toContain('billing@acme.com');
    expect(html).toContain('+1 555 1234');
    expect(html).toContain('123 Main St, New York, US');
  });

  it('draws the signature only when strokes exist', () => {
    expect(buildInvoiceHtml(demoInvoice)).not.toContain('<svg');
    const signed = buildInvoiceHtml({ ...demoInvoice, signature: '[{"points":[{"x":0,"y":0},{"x":360,"y":60}]}]' });
    expect(signed).toContain('<svg');
    expect(signed).toContain('<path d="M 10 25 L 190 55" />');
  });

  it('always shows discount and tax rows', () => {
    const html = buildInvoiceHtml(demoInvoice);
    expect(html).toContain('Discount (0.0%)');
    expect(html).toContain('Tax (10.0%)');
  });

  it('escapeHtml handles all special characters', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });
});

describe('pdfFileName', () => {
  it('sanitizes invalid characters', () => {
    expect(pdfFileName({ clientName: 'A/B: "C"', invoiceNumber: 'INV-1' })).toBe('A_B_ _C_-INV-1.pdf');
    expect(pdfFileName(demoInvoice)).toBe('Acme Corp-INV-001.pdf');
  });
});
