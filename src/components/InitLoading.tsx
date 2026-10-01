import { View } from 'react-native';

import { useTheme } from '@/constants/theme';

import { Text } from './Text';

/** Port of InitLoadingView. */
export function InitLoading() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Text variant="largeTitle" weight="700">
        ACorp Invoice
      </Text>
    </View>
  );
}
