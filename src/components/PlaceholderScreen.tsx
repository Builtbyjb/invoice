import { View } from 'react-native';

import { useTheme } from '@/constants/theme';

import { Text } from './Text';

/** Placeholder screens (Help, Account, Payment, Legal, Subscriptions) as in the Swift app. */
export function PlaceholderScreen({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Text variant="largeTitle">{title}</Text>
    </View>
  );
}
