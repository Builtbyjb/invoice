import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolView } from 'expo-symbols';
import type { SymbolWeight } from 'expo-symbols';
import type { StyleProp, ViewStyle } from 'react-native';

import { SF_FALLBACKS, type IoniconName, type SFName } from '@/constants/icons';
import { useTheme } from '@/constants/theme';

type Props = {
  sf: SFName;
  /** Overrides the default Ionicons fallback from the icon map. */
  fallback?: IoniconName;
  size?: number;
  color?: string;
  weight?: SymbolWeight;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ sf, fallback, size = 17, color, weight, style }: Props) {
  const { colors } = useTheme();
  const tint = color ?? colors.label;
  return (
    <SymbolView
      name={sf}
      size={size}
      tintColor={tint}
      weight={weight}
      resizeMode="scaleAspectFit"
      style={[{ width: size, height: size }, style]}
      fallback={<Ionicons name={fallback ?? SF_FALLBACKS[sf]} size={size} color={tint} />}
    />
  );
}
