import { useState } from 'react';
import { Alert } from 'react-native';

import { errorMessage } from '@/lib/api/errors';
import type { SignResponse } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth-store';

/** Shared by Sign In and Sign Up: call the endpoint, keep the temp token in memory, open the OTP sheet. */
export function useStartOtp(failureTitle: 'Sign In Failed' | 'Sign Up Failed') {
  const [otpVisible, setOtpVisible] = useState(false);

  const start = async (email: string, request: () => Promise<SignResponse>) => {
    try {
      const res = await request();
      useAuthStore.getState().beginOtp(email, res.accessToken);
      setOtpVisible(true);
    } catch (e) {
      Alert.alert(failureTitle, errorMessage(e), [{ text: 'OK', style: 'cancel' }]);
    }
  };

  const closeOtp = () => {
    setOtpVisible(false);
  };

  return { otpVisible, closeOtp, start };
}
