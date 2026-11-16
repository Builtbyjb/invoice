import { View } from 'react-native';

import { useTheme, withAlpha } from '../constants/theme';

import { Text } from './Text';

type Props = { name: string; size?: 48 | 42 };

export function Avatar({ name, size = 48 }: Props) {
  const { colors } = useTheme();
  const fontSize = size === 48 ? 20 : 18;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: withAlpha(colors.blue, 0.15),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text weight="600" color={colors.blue} style={{ fontSize, lineHeight: fontSize * 1.25 }}>
        {name.trim().charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
