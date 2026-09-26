import { forwardRef } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { radii, useTheme } from '@/constants/theme';

import { Text } from '../Text';
import { FieldError } from './FieldError';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  required?: boolean;
  error?: string;
  /** Inner padding of the input box (Swift used 12 on sign up, 16 on sign in). */
  padding?: number;
};

/** Label above a gray6 rounded input (port of the auth `customTextField`). */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, required, error, padding = 12, multiline, testID, ...rest },
  ref,
) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 4 }}>
      {label ? (
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <Text variant="footnote" weight="600" color={colors.gray}>
            {label}
          </Text>
          {required ? (
            <Text variant="footnote" weight="600" color={colors.red}>
              *
            </Text>
          ) : null}
        </View>
      ) : null}
      <TextInput
        ref={ref}
        testID={testID}
        accessibilityLabel={label}
        placeholderTextColor={colors.tertiaryLabel}
        multiline={multiline}
        {...rest}
        style={{
          padding,
          borderRadius: radii.input,
          backgroundColor: colors.fill,
          color: colors.label,
          fontSize: 17,
          minHeight: multiline ? 100 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
          borderWidth: error ? 1 : 0,
          borderColor: colors.red,
        }}
      />
      <FieldError message={error} testID={testID ? `${testID}-error` : undefined} />
    </View>
  );
});
