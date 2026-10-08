import { ActivityIndicator, View } from 'react-native';

import { StatCard } from '../../components/StatCard';
import { radii, useTheme } from '../../constants/theme';
import type { DashboardStats } from '../../schemas/dashboard';

import { useDashboardStats } from './hooks';

const ZERO: DashboardStats = { paidCount: 0, sentCount: 0, overdueCount: 0, draftCount: 0 };

/** Port of StatsCardsView. On error, zeros are shown (Swift kept its default zeros). */
export function StatsCards() {
  const { colors } = useTheme();
  const { data, isPending, isError } = useDashboardStats();

  if (isPending && !isError) {
    return (
      <View
        testID="stats-loading"
        style={{
          minHeight: 120,
          borderRadius: radii.card,
          backgroundColor: colors.secondaryBackground,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  const stats = data ?? ZERO;
  const cards = [
    { title: 'Paid Invoices', value: stats.paidCount, icon: 'checkmark.circle.fill', color: colors.green },
    { title: 'Overdue Invoices', value: stats.overdueCount, icon: 'exclamationmark.triangle.fill', color: colors.red },
    { title: 'Sent Invoices', value: stats.sentCount, icon: 'checkmark.circle', color: colors.orange },
    // Red on purpose: matches the Swift app.
    { title: 'Draft Invoices', value: stats.draftCount, icon: 'doc.text', color: colors.red },
  ] as const;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {cards.map((c) => (
        <View key={c.title} style={{ flexBasis: '46%', flexGrow: 1 }}>
          <StatCard title={c.title} value={String(c.value)} icon={c.icon} color={c.color} />
        </View>
      ))}
    </View>
  );
}
