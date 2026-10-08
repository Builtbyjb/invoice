import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { EmptyState } from '../../../../components/EmptyState';
import { FloatingSearchBar } from '../../../../components/FloatingSearchBar';
import { HeaderButtonGroup, HeaderIconButton } from '../../../../components/HeaderIconButton';
import { LoadingView } from '../../../../components/LoadingView';
import { useTheme } from '../../../../constants/theme';
import { filterInvoices } from '../../../../features/invoices/filter';
import { useInvoices } from '../../../../features/invoices/hooks';
import { InvoiceListCard } from '../../../../features/invoices/InvoiceListCard';
import { useRefreshOnFocus } from '../../../../hooks/useRefreshOnFocus';
import { errorMessage } from '../../../../lib/api/errors';
import { useCoordinatorStore, type SearchToken } from '../../../../stores/coordinator-store';

/** Port of InvoicesView. */
export default function InvoicesScreen() {
  const { colors } = useTheme();
  const invoices = useInvoices();
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchToken, setSearchToken] = useState<SearchToken | null>(null);
  useRefreshOnFocus(invoices.refetch);

  // One-shot filter handed over from a client's "View invoices" button.
  useFocusEffect(
    useCallback(() => {
      const pending = useCoordinatorStore.getState().consumePendingInvoiceSearchToken();
      if (pending) {
        setSearchToken(pending);
        setShowSearch(true);
      }
    }, []),
  );

  const filtered = useMemo(
    () => (showSearch ? filterInvoices(invoices.data ?? [], searchToken, searchText) : (invoices.data ?? [])),
    [invoices.data, searchToken, searchText, showSearch],
  );

  const closeSearch = () => {
    setSearchText('');
    setSearchToken(null);
    setShowSearch(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <HeaderButtonGroup>
              <HeaderIconButton sf="plus" accessibilityLabel="New invoice" testID="invoices-add" onPress={() => router.push('/invoices/new')} />
              <HeaderIconButton
                sf="magnifyingglass"
                accessibilityLabel="Search invoices"
                testID="invoices-search"
                onPress={() => (showSearch ? closeSearch() : setShowSearch(true))}
              />
            </HeaderButtonGroup>
          ),
        }}
      />

      {invoices.isPending ? (
        <LoadingView />
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: showSearch ? 96 : 8, gap: 12 }}
          renderItem={({ item }) => (
            <InvoiceListCard
              invoice={item}
              onPress={() => router.push({ pathname: '/invoices/[id]', params: { id: item.id } })}
            />
          )}
          refreshControl={<RefreshControl refreshing={invoices.isRefetching} onRefresh={() => invoices.refetch()} />}
          ListEmptyComponent={
            invoices.isError ? (
              <EmptyState
                icon="exclamationmark.triangle.fill"
                title="Couldn't load invoices"
                description={errorMessage(invoices.error)}
                actionLabel="Try Again"
                onAction={() => invoices.refetch()}
                style={{ paddingTop: 40 }}
              />
            ) : (
              <EmptyState
                icon="doc.text.magnifyingglass"
                title="No Invoices"
                description="Create your first invoice using the + button."
                style={{ paddingTop: 40 }}
              />
            )
          }
        />
      )}

      {showSearch ? (
        <FloatingSearchBar
          text={searchText}
          onChangeText={setSearchText}
          token={searchToken}
          onClearToken={() => setSearchToken(null)}
          onClose={closeSearch}
        />
      ) : null}
    </View>
  );
}
