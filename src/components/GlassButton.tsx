import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Pressable, View } from 'react-native';

import { useTheme, withAlpha } from '@/constants/theme';

import { Text } from './Text';

type Props = {
  title: string;
  onPress: () => void;
  /** `prominent`: blue tinted (SwiftUI `.glassProminent`); otherwise plain glass (`.glass`). */
  prominent?: boolean;
  width?: number;
  testID?: string;
};

/** Liquid Glass capsule button with a solid fallback when glass isn't available. */
export function GlassButton({ title, onPress, prominent, width = 200, testID }: Props) {
  const { colors } = useTheme();
  const glass = isLiquidGlassAvailable();
  const textColor = prominent ? '#FFFFFF' : colors.label;
  const label = (
    <Text weight="500" color={textColor} align="center" style={{ paddingVertical: 8 }}>
      {title}
    </Text>
  );
  const shape = { width: width + 32, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 16 };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {glass ? (
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          tintColor={prominent ? colors.blue : undefined}
          style={shape}
        >
          {label}
        </GlassView>
      ) : (
        <View
          style={[
            shape,
            { backgroundColor: prominent ? colors.blue : withAlpha(colors.gray, 0.18) },
          ]}
        >
          {label}
        </View>
      )}
    </Pressable>
  );
}
