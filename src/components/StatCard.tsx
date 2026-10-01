import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { SFName } from '@/constants/icons';
import { radii, useTheme } from '@/constants/theme';

import { IconTile } from './IconTile';
import { Text } from './Text';

type Props = {
  title: string;
  value: string;
  icon: SFName;
  color: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Port of StatCard (used by the dashboard and referral screens). */
export function StatCard({ title, value, icon, color, style, testID }: Props) {
  const { colors } = useTheme();
  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={`${title}: ${value}`}
      style={[
        { padding: 16, gap: 12, borderRadius: radii.card, backgroundColor: colors.secondaryBackground, width: '100%' },
        style,
      ]}
    >
      <IconTile sf={icon} color={color} iconSize={22} />
      <View style={{ gap: 4 }}>
        <Text variant="title2" weight="700" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {value}
        </Text>
        <Text variant="subheadline" secondary numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
}
