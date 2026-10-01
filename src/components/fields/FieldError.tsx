import { useTheme } from '@/constants/theme';

import { Text } from '../Text';

export function FieldError({ message, testID }: { message?: string; testID?: string }) {
  const { colors } = useTheme();
  if (!message) return null;
  return (
    <Text testID={testID} variant="caption" color={colors.red} accessibilityRole="alert" style={{ marginTop: 4 }}>
      {message}
    </Text>
  );
}
