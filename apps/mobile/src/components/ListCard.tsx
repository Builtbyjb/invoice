import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { cardShadow, radii, useTheme } from '../constants/theme';

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

/** Tappable list card shared by clients and invoices (systemBackground, 1px black@5% border, shadow). */
export function ListCard({ onPress, children, accessibilityLabel, testID, style }: Props) {
  const { colors, dark } = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderRadius: radii.card,
          backgroundColor: dark ? colors.secondaryBackground : colors.background,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
          opacity: pressed ? 0.7 : 1,
        },
        cardShadow,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
