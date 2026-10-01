import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';

import { verifyOtp } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';

import { OtpInput, sanitizeOtp } from '../OtpInput';
import { OtpSheet } from '../OtpSheet';
import { formatCountdown } from '../useCountdown';

jest.mock('@/lib/api/auth', () => ({ verifyOtp: jest.fn(), resendOtp: jest.fn(), refresh: jest.fn() }));

function Harness() {
  const [code, setCode] = useState('');
  return <OtpInput value={code} onChange={setCode} autoFocus={false} />;
}

describe('OtpInput', () => {
  it('strips non-digits and caps at 8 digits', async () => {
    expect(sanitizeOtp('12-34 ab5678999')).toBe('12345678');
    await render(<Harness />);
    await fireEvent.changeText(screen.getByTestId('otp-input'), '1a2b3c4d5e6f7g8h9');
    expect(screen.getByTestId('otp-input').props.value).toBe('12345678');
  });
});

describe('OtpSheet', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useAuthStore.setState({ state: 'notAuthenticated', pendingOtp: { email: 'a@b.com', tempToken: 'temp' } });
  });
  afterEach(() => jest.useRealTimers());

  it('keeps Verify disabled until 8 digits are entered, then verifies with the temp token', async () => {
    (verifyOtp as jest.Mock).mockResolvedValue({ accessToken: 'a', refreshToken: 'r' });
    const onClose = jest.fn();
    await render(<OtpSheet visible onClose={onClose} />);

    const verify = screen.getByTestId('otp-verify');
    expect(verify).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('otp-input'), '1234567');
    expect(screen.getByTestId('otp-verify')).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('otp-input'), '12345678');
    expect(screen.getByTestId('otp-verify')).toBeEnabled();

    await fireEvent.press(screen.getByTestId('otp-verify'));
    expect(verifyOtp).toHaveBeenCalledWith('12345678', 'temp');
    expect(onClose).toHaveBeenCalled();
    expect(useAuthStore.getState().state).toBe('authenticated');
  });

  it('shows the resend countdown and enables Resend after 60 s', async () => {
    await render(<OtpSheet visible onClose={jest.fn()} />);
    expect(screen.getByText('Resend available in 01:00')).toBeOnTheScreen();
    expect(screen.getByTestId('otp-resend')).toBeDisabled();
    await act(async () => {
      jest.advanceTimersByTime(61_000);
    });
    expect(screen.queryByText(/Resend available in/)).toBeNull();
    expect(screen.getByTestId('otp-resend')).toBeEnabled();
  });

  it('formats the countdown as MM:SS', () => {
    expect(formatCountdown(60)).toBe('01:00');
    expect(formatCountdown(9)).toBe('00:09');
  });
});
