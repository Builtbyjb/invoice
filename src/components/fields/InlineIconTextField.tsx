import { TextInput, View, type TextInputProps } from 'react-native';

import type { SFName } from '@/constants/icons';
import { useTheme } from '@/constants/theme';

import { Icon } from '../Icon';
import { FieldError } from './FieldError';

type Props = Omit<TextInputProps, 'style'> & {
  icon: SFName;
  error?: string;
};

/** Icon + text input row inside a FormSection (port of LabeledTextField). */
export function InlineIconTextField({ icon, error, placeholder, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 11 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 24, alignItems: 'center' }}>
          <Icon sf={icon} size={17} color={colors.gray} />
        </View>
        <TextInput
          placeholder={placeholder}
          accessibilityLabel={placeholder}
          placeholderTextColor={colors.tertiaryLabel}
          autoCapitalize="none"
          {...rest}
          style={{ flex: 1, fontSize: 17, color: colors.label, paddingVertical: 0, minHeight: 22 }}
        />
      </View>
      {error ? (
        <View style={{ marginLeft: 36 }}>
          <FieldError message={error} />
        </View>
      ) : null}
    </View>
  );
}
