import { useColorScheme } from 'react-native';
import type { TextStyle } from 'react-native';

export type ThemeColors = {
  background: string;
  secondaryBackground: string;
  tertiaryBackground: string;
  groupedBackground: string;
  groupedCell: string;
  fill: string;
  gray5: string;
  gray3: string;
  separator: string;
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  blue: string;
  green: string;
  red: string;
  orange: string;
  purple: string;
  gray: string;
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  secondaryBackground: '#F2F2F7',
  tertiaryBackground: '#FFFFFF',
  groupedBackground: '#F2F2F7',
  groupedCell: '#FFFFFF',
  fill: '#F2F2F7',
  gray5: '#E5E5EA',
  gray3: '#C7C7CC',
  separator: '#D1D1D6',
  label: '#000000',
  secondaryLabel: 'rgba(60,60,67,0.6)',
  tertiaryLabel: 'rgba(60,60,67,0.3)',
  blue: '#007AFF',
  green: '#34C759',
  red: '#FF3B30',
  orange: '#FF9500',
  purple: '#AF52DE',
  gray: '#8E8E93',
};

export const darkColors: ThemeColors = {
  background: '#000000',
  secondaryBackground: '#1C1C1E',
  tertiaryBackground: '#2C2C2E',
  groupedBackground: '#000000',
  groupedCell: '#1C1C1E',
  fill: '#1C1C1E',
  gray5: '#2C2C2E',
  gray3: '#48484A',
  separator: '#3A3A3C',
  label: '#FFFFFF',
  secondaryLabel: 'rgba(235,235,245,0.6)',
  tertiaryLabel: 'rgba(235,235,245,0.3)',
  blue: '#0A84FF',
  green: '#30D158',
  red: '#FF453A',
  orange: '#FF9F0A',
  purple: '#BF5AF2',
  gray: '#8E8E93',
};

export const radii = {
  card: 16,
  inner: 12,
  input: 8,
  tile: 10,
} as const;

/** iOS Dynamic Type default sizes (Large). */
export const typography = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '400' },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '400' },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '400' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '400' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '400' },
} satisfies Record<string, TextStyle>;

export type Theme = {
  dark: boolean;
  colors: ThemeColors;
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return { dark, colors: dark ? darkColors : lightColors };
}

/** Returns `color` with the given alpha, for hex (#RRGGBB) inputs. */
export function withAlpha(color: string, alpha: number): string {
  const match = /^#([0-9a-f]{6})$/i.exec(color);
  if (!match) return color;
  const n = parseInt(match[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

export const cardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

export const lightCardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;
