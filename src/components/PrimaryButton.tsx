import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { radii, typography, useTheme, withAlpha } from '@/constants/theme';

import { Text } from './Text';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function PrimaryButton({ title, onPress, loading, disabled, style, testID }: Props) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: disabled ? withAlpha(colors.gray, 0.4) : colors.blue,
          paddingVertical: 14,
          borderRadius: radii.input,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: typography.headline.lineHeight + 28,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text variant="headline" color="#FFFFFF">
          {title}
        </Text>
      )}
    </Pressable>
  );
}
