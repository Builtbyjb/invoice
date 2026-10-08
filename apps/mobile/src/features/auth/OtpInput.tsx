import { useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Text } from '../../components/Text';
import { radii, useTheme, withAlpha } from '../../constants/theme';
import { OTP_LENGTH } from '../../schemas/auth';

type Props = {
  value: string;
  onChange: (code: string) => void;
  autoFocus?: boolean;
};

/** Strips non-digits and caps the code at 8 digits (Swift onChange filter). */
export const sanitizeOtp = (text: string) => text.replace(/\D/g, '').slice(0, OTP_LENGTH);

/** Hidden TextInput overlaid by two groups of 4 digit boxes (port of ValidateOTPView). */
export function OtpInput({ value, onChange, autoFocus = true }: Props) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const box = (index: number) => {
    const char = value[index];
    let borderColor = withAlpha(colors.gray, 0.2);
    let borderWidth = 1;
    if (char !== undefined) {
      borderColor = withAlpha(colors.blue, 0.5);
    } else if (index === value.length && focused) {
      borderColor = colors.blue;
      borderWidth = 2;
    }
    return (
      <View
        key={index}
        testID={`otp-box-${index}`}
        style={{
          flex: 1,
          height: 56,
          borderRadius: radii.input,
          backgroundColor: colors.fill,
          borderColor,
          borderWidth,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text variant="title2" weight="700">
          {char ?? ''}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <TextInput
        ref={inputRef}
        testID="otp-input"
        value={value}
        onChangeText={(t) => onChange(sanitizeOtp(t))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        autoFocus={autoFocus}
        caretHidden
        accessibilityLabel="Verification code"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />
      <Pressable
        accessible={false}
        onPress={() => inputRef.current?.focus()}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
      >
        <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>{[0, 1, 2, 3].map(box)}</View>
        <View style={{ width: 12, height: 2, backgroundColor: withAlpha(colors.gray, 0.4) }} />
        <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>{[4, 5, 6, 7].map(box)}</View>
      </Pressable>
    </View>
  );
}
