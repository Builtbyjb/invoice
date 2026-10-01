import { useState } from 'react';
import { RefreshControl, ScrollView, type ScrollViewProps } from 'react-native';

import { useTheme } from '@/constants/theme';

type Props = ScrollViewProps & {
  /** When provided, enables pull-to-refresh. */
  onRefresh?: () => Promise<unknown>;
  background?: string;
};

export function ScreenScrollView({ onRefresh, background, style, children, ...rest }: Props) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      {...rest}
      style={[{ flex: 1, backgroundColor: background ?? colors.background }, style]}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} /> : undefined
      }
    >
      {children}
    </ScrollView>
  );
}
