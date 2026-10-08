import { View } from 'react-native';

import { Icon } from '../../components/Icon';
import { Text } from '../../components/Text';
import type { SFName } from '../../constants/icons';
import { useTheme } from '../../constants/theme';

/** Port of InfoRow: blue icon, caption label, value ("—" when empty). */
export function InfoRow({ icon, label, value }: { icon: SFName; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }} accessible accessibilityLabel={`${label}: ${value || 'none'}`}>
      <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Icon sf={icon} size={18} color={colors.blue} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="caption" secondary>
          {label}
        </Text>
        <Text variant="subheadline">{value === '' ? '—' : value}</Text>
      </View>
    </View>
  );
}
