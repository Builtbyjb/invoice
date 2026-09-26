import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SheetHeader } from '@/components/SheetHeader';
import { Text } from '@/components/Text';
import { TextButton } from '@/components/TextButton';
import { useTheme } from '@/constants/theme';
import { resendOtp, verifyOtp } from '@/lib/api/auth';
import { errorMessage } from '@/lib/api/errors';
import { OTP_LENGTH, otpFormSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth-store';

import { OtpInput } from './OtpInput';
import { formatCountdown, useCountdown } from './useCountdown';

type Props = {
  visible: boolean;
  onClose: () => void;
};

/** Port of ValidateOTPView, presented as a page sheet from Sign In and Sign Up. */
export function OtpSheet({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      {visible ? <OtpContent onClose={onClose} /> : null}
    </Modal>
  );
}

function OtpContent({ onClose }: { onClose: () => void }) {
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const countdown = useCountdown(60);
  const complete = code.length === OTP_LENGTH;

  const verify = async () => {
    const pending = useAuthStore.getState().pendingOtp;
    const parsed = otpFormSchema.safeParse({ code });
    if (!parsed.success) {
      Alert.alert('Verification Failed', parsed.error.issues[0]?.message, [{ text: 'OK', style: 'cancel' }]);
      return;
    }
    if (!pending) return;
    setVerifying(true);
    try {
      const token = await verifyOtp(parsed.data.code, pending.tempToken);
      onClose();
      // The root gate switches to the tabs once the state becomes `authenticated`.
      await useAuthStore.getState().completeOtp(token);
    } catch (e) {
      setVerifying(false);
      Alert.alert('Verification Failed', errorMessage(e), [{ text: 'OK', style: 'cancel' }]);
    }
  };

  const resend = async () => {
    const pending = useAuthStore.getState().pendingOtp;
    if (!pending) return;
    setResending(true);
    try {
      await resendOtp(pending.email);
      countdown.restart();
    } catch (e) {
      Alert.alert('Resend Failed', errorMessage(e), [{ text: 'OK', style: 'cancel' }]);
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SheetHeader title="OTP Verification" left={<TextButton title="Cancel" onPress={onClose} testID="otp-cancel" />} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24, gap: 32 }}>
        <View style={{ gap: 8, paddingTop: 16, alignItems: 'center' }}>
          <Text variant="title2" weight="700">
            Verification Code
          </Text>
          <Text variant="subheadline" color={colors.gray} align="center" style={{ paddingHorizontal: 16 }}>
            We sent an 8-digit code to your email. Please enter it below to confirm your identity.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <OtpInput value={code} onChange={setCode} />
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <PrimaryButton
            testID="otp-verify"
            title="Verify Code"
            onPress={verify}
            loading={verifying}
            disabled={!complete}
          />
        </View>

        <View style={{ alignItems: 'center', gap: 8 }}>
          {resending ? (
            <ActivityIndicator />
          ) : (
            <Pressable
              testID="otp-resend"
              accessibilityRole="button"
              accessibilityState={{ disabled: countdown.active }}
              disabled={countdown.active}
              onPress={resend}
              hitSlop={8}
            >
              <Text variant="subheadline" weight="600" color={countdown.active ? colors.gray : colors.blue}>
                Resend Code
              </Text>
            </Pressable>
          )}
          {countdown.active ? (
            <Text variant="caption" color={colors.gray}>
              Resend available in {formatCountdown(countdown.remaining)}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
