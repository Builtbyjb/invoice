import { Text as RNText, type TextProps } from 'react-native';

import { typography, useTheme } from '../constants/theme';

export type TextVariant = keyof typeof typography;

type Props = TextProps & {
  variant?: TextVariant;
  color?: string;
  secondary?: boolean;
  weight?: '400' | '500' | '600' | '700' | '800';
  align?: 'left' | 'center' | 'right';
};

/** Themed text using iOS Dynamic Type sizes. */
export function Text({ variant = 'body', color, secondary, weight, align, style, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <RNText
      {...rest}
      style={[
        typography[variant],
        { color: color ?? (secondary ? colors.secondaryLabel : colors.label) },
        weight ? { fontWeight: weight } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}
