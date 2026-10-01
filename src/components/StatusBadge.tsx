import { View } from 'react-native';

import { useTheme, withAlpha, type ThemeColors } from '@/constants/theme';
import type { InvoiceStatus } from '@/schemas/invoice';

import { Text } from './Text';

export function statusColor(status: InvoiceStatus, colors: ThemeColors): string {
  switch (status) {
    case 'draft':
      return colors.gray;
    case 'sent':
      return colors.blue;
    case 'paid':
      return colors.green;
    case 'overdue':
      return colors.red;
  }
}

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const { colors } = useTheme();
  const color = statusColor(status, colors);
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        backgroundColor: withAlpha(color, 0.12),
      }}
    >
      <Text variant="caption" weight="500" color={color}>
        {status}
      </Text>
    </View>
  );
}
