import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View, type LayoutChangeEvent } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { SelectSheet, toOptions } from '@/components/SelectSheet';
import { Text } from '@/components/Text';
import { radii, typography, useTheme } from '@/constants/theme';
import { tokenStore } from '@/lib/auth/token-store';
import type { MonthlyRevenue } from '@/schemas/dashboard';

import { LIFETIME, useMonthlyRevenue } from './hooks';
import { availableCurrencies, availableYears, compactNumber, currencyColor, sortByMonth } from './revenue';

const CHART_HEIGHT = 220;

/** Port of RevenueChartView. */
export function RevenueChart() {
  const { colors } = useTheme();
  const [year, setYear] = useState(LIFETIME);
  const [currency, setCurrency] = useState<string>();

  useEffect(() => {
    let active = true;
    tokenStore
      .preferredCurrency()
      .then((c) => active && setCurrency((current) => current ?? c ?? 'USD'))
      .catch(() => active && setCurrency((current) => current ?? 'USD'));
    return () => {
      active = false;
    };
  }, []);

  const { data, isPending } = useMonthlyRevenue(year, currency);
  const selectedCurrency = currency ?? 'USD';

  return (
    <View style={{ padding: 16, gap: 16, borderRadius: radii.card, backgroundColor: colors.secondaryBackground }}>
      <Text variant="title3" weight="600">
        Revenue
      </Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <DropdownPill title="Year" value={year} options={availableYears()} onChange={setYear} testID="revenue-year" />
        <DropdownPill
          title="Currency"
          value={selectedCurrency}
          options={availableCurrencies(selectedCurrency)}
          onChange={setCurrency}
          testID="revenue-currency"
        />
      </View>

      {isPending || !currency ? (
        <View
          style={{
            height: CHART_HEIGHT,
            borderRadius: radii.inner,
            backgroundColor: colors.tertiaryBackground,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator />
        </View>
      ) : !data || data.length === 0 ? (
        <EmptyState icon="chart.bar" title="No Data" style={{ height: CHART_HEIGHT }} />
      ) : (
        <RevenueBars data={data} currency={selectedCurrency} />
      )}
    </View>
  );
}

function DropdownPill({
  title,
  value,
  options,
  onChange,
  testID,
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  testID?: string;
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${value}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: radii.tile,
          backgroundColor: colors.tertiaryBackground,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text variant="subheadline" weight="500" color={colors.blue}>
          {value}
        </Text>
        <Icon sf="chevron.down" size={11} color={colors.blue} weight="semibold" />
      </Pressable>
      <SelectSheet
        visible={open}
        title={title}
        options={toOptions(options)}
        value={value}
        onChange={onChange}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

function RevenueBars({ data, currency }: { data: MonthlyRevenue[]; currency: string }) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const sorted = sortByMonth(data);
  const color = currencyColor(currency, colors);

  const yAxisWidth = 44;
  const plotWidth = Math.max(width - yAxisWidth - 8, 0);
  const slot = sorted.length > 0 ? plotWidth / sorted.length : 0;
  const barWidth = Math.max(Math.min(slot * 0.6, 28), 4);
  const spacing = Math.max(slot - barWidth, 2);
  // About 6 x-axis labels: show every other month when crowded.
  const labelEvery = sorted.length > 6 ? 2 : 1;

  const bars = sorted.map((item, i) => ({
    value: item.amount,
    label: i % labelEvery === 0 ? item.month : '',
    frontColor: color,
  }));

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={{ gap: 12 }}>
      <View onLayout={onLayout} style={{ height: CHART_HEIGHT + 24 }} testID="revenue-chart">
        {width > 0 ? (
          <BarChart
            data={bars}
            height={CHART_HEIGHT - 20}
            width={plotWidth}
            barWidth={barWidth}
            spacing={spacing}
            initialSpacing={spacing / 2}
            endSpacing={0}
            barBorderRadius={6}
            noOfSections={4}
            yAxisLabelWidth={yAxisWidth}
            formatYLabel={(label) => compactNumber(Number(label))}
            yAxisTextStyle={{ color: colors.secondaryLabel, fontSize: typography.caption2.fontSize }}
            xAxisLabelTextStyle={{ color: colors.secondaryLabel, fontSize: typography.caption2.fontSize }}
            yAxisColor="transparent"
            xAxisColor={colors.separator}
            rulesColor={colors.separator}
            rulesType="solid"
            disableScroll
            disablePress
            isAnimated
          />
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
        <Text variant="caption" secondary>
          {currency}
        </Text>
      </View>
    </View>
  );
}
