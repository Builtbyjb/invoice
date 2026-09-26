import { fireEvent, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { createClient, updateClient } from '@/lib/api/clients';
import { ApiError } from '@/lib/api/errors';
import { demoClient } from '@/lib/demo-data';
import { renderWithQuery } from '@/test-utils/render';

import { ClientFormSheet } from '../ClientFormSheet';

jest.mock('@/lib/api/clients', () => ({
  createClient: jest.fn(),
  updateClient: jest.fn(),
  listClients: jest.fn(async () => []),
}));

beforeEach(() => jest.clearAllMocks());

describe('ClientFormSheet', () => {
  it('disables Save until name and a valid email are entered, then creates the client', async () => {
    (createClient as jest.Mock).mockResolvedValue({ ...demoClient, id: 'new' });
    const onSaved = jest.fn();
    const onClose = jest.fn();
    await renderWithQuery(<ClientFormSheet visible mode={{ type: 'create' }} onClose={onClose} onSaved={onSaved} />);

    expect(screen.getByText('New Client')).toBeOnTheScreen();
    expect(screen.getByTestId('client-form-save')).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('client-name'), 'Acme');
    expect(screen.getByTestId('client-form-save')).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('client-email'), 'not-an-email');
    await fireEvent(screen.getByTestId('client-email'), 'blur');
    expect(screen.getByTestId('client-form-save')).toBeDisabled();
    expect(screen.getByText('Please enter a valid email address.')).toBeOnTheScreen();

    await fireEvent.changeText(screen.getByTestId('client-email'), 'a@acme.com');
    expect(screen.getByTestId('client-form-save')).toBeEnabled();

    await fireEvent.press(screen.getByTestId('client-form-save'));
    expect(createClient).toHaveBeenCalledWith({
      name: 'Acme',
      email: 'a@acme.com',
      phone: '',
      address: '',
      city: '',
      country: '',
      note: '',
    });
    expect(onSaved).toHaveBeenCalledWith(expect.objectContaining({ id: 'new' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('pre-fills edit mode and shows "Save Failed" on error, keeping the sheet open', async () => {
    (updateClient as jest.Mock).mockRejectedValue(ApiError.server(500, 'boom'));
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const onClose = jest.fn();
    await renderWithQuery(<ClientFormSheet visible mode={{ type: 'edit', client: demoClient }} onClose={onClose} />);

    expect(screen.getByText('Edit Client')).toBeOnTheScreen();
    expect(screen.getByTestId('client-name').props.value).toBe('Acme Corp');
    expect(screen.getByTestId('client-note').props.value).toBe(demoClient.note);

    await fireEvent.press(screen.getByTestId('client-form-save'));
    expect(updateClient).toHaveBeenCalledWith(demoClient.id, expect.objectContaining({ name: 'Acme Corp' }));
    expect(alert).toHaveBeenCalledWith('Save Failed', 'Error 500: boom', expect.any(Array));
    expect(onClose).not.toHaveBeenCalled();
  });
});
