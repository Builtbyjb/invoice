import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../constants/theme';
import type { SFName } from '../constants/icons';

import { Icon } from './Icon';
import { Text } from './Text';

type Props = {
  icon: SFName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Port of SwiftUI ContentUnavailableView. */
export function EmptyState({ icon, title, description, actionLabel, onAction, style }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 }, style]}>
      <Icon sf={icon} size={44} color={colors.secondaryLabel} style={{ marginBottom: 8 }} />
      <Text variant="title2" weight="700" align="center">
        {title}
      </Text>
      {description ? (
        <Text variant="subheadline" secondary align="center">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8} style={{ marginTop: 8 }}>
          <Text color={colors.blue}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
