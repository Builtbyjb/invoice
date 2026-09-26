import { View, type ViewProps } from 'react-native';

import { radii, useTheme } from '@/constants/theme';

export function Card({ style, ...rest }: ViewProps) {
  const { colors } = useTheme();
  return (
    <View
      {...rest}
      style={[{ padding: 16, borderRadius: radii.card, backgroundColor: colors.secondaryBackground }, style]}
    />
  );
}
