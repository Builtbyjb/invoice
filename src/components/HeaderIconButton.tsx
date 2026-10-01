import { ActivityIndicator, Pressable, View } from 'react-native';

import type { SFName } from '@/constants/icons';
import { useTheme } from '@/constants/theme';

import { Icon } from './Icon';

type Props = {
  sf: SFName;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  children?: React.ReactNode;
};

/** A toolbar icon button (port of SwiftUI toolbar `Button { Image(systemName:) }`). */
export function HeaderIconButton({ sf, onPress, color, disabled, loading, accessibilityLabel, testID, children }: Props) {
  const { colors } = useTheme();
  const tint = disabled ? colors.gray : (color ?? colors.label);
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? sf}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.5 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <Icon sf={sf} size={20} color={tint} />
          {children}
        </View>
      )}
    </Pressable>
  );
}

export function HeaderButtonGroup({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>{children}</View>;
}
