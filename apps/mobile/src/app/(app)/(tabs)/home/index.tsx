import { useQueryClient } from '@tanstack/react-query';
import { View } from 'react-native';

import { ScreenScrollView } from '../../../../components/ScreenScrollView';
import { RevenueChart } from '../../../../features/home/RevenueChart';
import { StatsCards } from '../../../../features/home/StatsCards';
import { useRefreshOnFocus } from '../../../../hooks/useRefreshOnFocus';
import { qk } from '../../../../lib/query/keys';

/** Port of HomeView ("Dashboard"). */
export default function DashboardScreen() {
  const queryClient = useQueryClient();
  const refetchAll = () => queryClient.refetchQueries({ queryKey: qk.dashboard.all, type: 'active' });
  useRefreshOnFocus(refetchAll);

  return (
    <ScreenScrollView onRefresh={refetchAll}>
      <View style={{ paddingVertical: 16, paddingHorizontal: 16, gap: 24 }}>
        <StatsCards />
        <RevenueChart />
      </View>
    </ScreenScrollView>
  );
}
