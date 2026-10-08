import { View } from 'react-native';

import { useTheme } from '../constants/theme';

import { Text } from './Text';

type Props = {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

/** Navigation-bar-like header for page-sheet modals. */
export function SheetHeader({ title, left, right }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.separator,
      }}
    >
      <View style={{ flex: 1, alignItems: 'flex-start' }}>{left}</View>
      <Text variant="headline" numberOfLines={1}>
        {title}
      </Text>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}
