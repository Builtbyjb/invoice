import { fireEvent, screen } from '@testing-library/react-native';

import { demoInvoice } from '../../../lib/demo-data';
import { renderWithQuery } from '../../../test-utils/render';

import { InvoiceForm } from '../InvoiceForm';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  router: { back: jest.fn(), replace: jest.fn(), push: jest.fn() },
}));

jest.mock('@/lib/api/clients', () => ({ searchClients: jest.fn(async () => []) }));

const text = (id: string) => screen.getByTestId(id).props.children as string | string[];
const joined = (id: string) => ([] as string[]).concat(text(id)).join('');

describe('InvoiceForm', () => {
  it('adds and removes line items and updates the live totals', async () => {
    await renderWithQuery(<InvoiceForm mode={{ type: 'create' }} preferredCurrency="USD" />);

    expect(joined('invoice-grand-total')).toMatch(/\$0\.00/);

    await fireEvent.press(screen.getByTestId('invoice-add-item'));
    await fireEvent.changeText(screen.getByTestId('item-0-description'), 'Design');
    await fireEvent.changeText(screen.getByTestId('item-0-quantity'), '2');
    await fireEvent.changeText(screen.getByTestId('item-0-price'), '50');
    expect(joined('item-0-total')).toMatch(/\$100\.00/);

    await fireEvent.press(screen.getByTestId('invoice-add-item'));
    await fireEvent.changeText(screen.getByTestId('item-1-price'), '100');
    // quantity defaults to "1" for new items
    expect(joined('invoice-subtotal')).toMatch(/\$200\.00/);

    await fireEvent.changeText(screen.getByTestId('invoice-discount'), '10');
    await fireEvent.changeText(screen.getByTestId('invoice-tax'), '10');
    // (200 - 20) * 1.1 = 198
    expect(joined('invoice-grand-total')).toMatch(/\$198\.00/);

    // Invalid numeric text counts as 0 in the live totals.
    await fireEvent.changeText(screen.getByTestId('invoice-tax'), 'abc');
    expect(joined('invoice-grand-total')).toMatch(/\$180\.00/);

    await fireEvent.press(screen.getByTestId('item-0-remove'));
    expect(screen.queryByTestId('item-1-description')).toBeNull();
    expect(joined('invoice-subtotal')).toMatch(/\$100\.00/);
  });

  it('pre-fills edit mode including discount and tax', async () => {
    await renderWithQuery(
      <InvoiceForm mode={{ type: 'edit', invoice: { ...demoInvoice, discount: 5 } }} preferredCurrency="USD" />,
    );
    expect(screen.getByTestId('invoice-client-name')).toHaveTextContent('Acme Corp');
    expect(screen.getByTestId('item-0-description').props.value).toBe('Consulting');
    expect(screen.getByTestId('item-0-quantity').props.value).toBe('10');
    expect(screen.getByTestId('item-0-price').props.value).toBe('150');
    expect(screen.getByTestId('invoice-discount').props.value).toBe('5');
    expect(screen.getByTestId('invoice-tax').props.value).toBe('10');
    // 1500 * 0.95 * 1.1 = 1567.50
    expect(joined('invoice-grand-total')).toMatch(/\$1,567\.50/);
  });
});
