import { Pressable } from 'react-native';

import { useTheme } from '../constants/theme';

import { Text, type TextVariant } from './Text';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  variant?: TextVariant;
  weight?: '400' | '500' | '600' | '700';
  testID?: string;
};

export function TextButton({ title, onPress, disabled, color, variant = 'body', weight, testID }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingHorizontal: 4, paddingVertical: 4 })}
    >
      <Text variant={variant} weight={weight} color={disabled ? colors.gray : (color ?? colors.blue)}>
        {title}
      </Text>
    </Pressable>
  );
}
