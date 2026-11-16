import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { EmptyState } from '../../../../components/EmptyState';
import { FloatingSearchBar } from '../../../../components/FloatingSearchBar';
import { HeaderButtonGroup, HeaderIconButton } from '../../../../components/HeaderIconButton';
import { LoadingView } from '../../../../components/LoadingView';
import { useTheme } from '../../../../constants/theme';
import { ClientCard } from '../../../../features/clients/ClientCard';
import { ClientFormSheet } from '../../../../features/clients/ClientFormSheet';
import { useClients, useClientSearch } from '../../../../features/clients/hooks';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import { useRefreshOnFocus } from '../../../../hooks/useRefreshOnFocus';
import { errorMessage } from '../../../../lib/api/errors';

/** Port of ClientsView. */
export default function ClientsScreen() {
  const { colors } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const debounced = useDebouncedValue(searchText.trim(), 300);
  const searching = showSearch && debounced !== '';

  const clients = useClients();
  const search = useClientSearch(debounced, searching);
  const active = searching ? search : clients;
  useRefreshOnFocus(clients.refetch);

  const closeSearch = () => {
    setSearchText('');
    setShowSearch(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <HeaderButtonGroup>
              <HeaderIconButton sf="plus" accessibilityLabel="New client" testID="clients-add" onPress={() => setShowCreate(true)} />
              <HeaderIconButton
                sf="magnifyingglass"
                accessibilityLabel="Search clients"
                testID="clients-search"
                onPress={() => (showSearch ? closeSearch() : setShowSearch(true))}
              />
            </HeaderButtonGroup>
          ),
        }}
      />

      {active.isPending && !active.data ? (
        <LoadingView />
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          data={active.data ?? []}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: showSearch ? 96 : 8, gap: 12 }}
          renderItem={({ item }) => (
            <ClientCard client={item} onPress={() => router.push({ pathname: '/clients/[id]', params: { id: item.id } })} />
          )}
          refreshControl={
            <RefreshControl refreshing={active.isRefetching && !active.isPending} onRefresh={() => active.refetch()} />
          }
          ListEmptyComponent={
            active.isError ? (
              <EmptyState
                icon="exclamationmark.triangle.fill"
                title="Couldn't load clients"
                description={errorMessage(active.error)}
                actionLabel="Try Again"
                onAction={() => active.refetch()}
                style={{ paddingTop: 40 }}
              />
            ) : (
              <EmptyState
                icon="person.crop.circle.badge.xmark"
                title="No Clients"
                description="Add your first client using the + button above."
                style={{ paddingTop: 40 }}
              />
            )
          }
        />
      )}

      {showSearch ? <FloatingSearchBar text={searchText} onChangeText={setSearchText} onClose={closeSearch} /> : null}

      <ClientFormSheet visible={showCreate} mode={{ type: 'create' }} onClose={() => setShowCreate(false)} />
    </View>
  );
}
