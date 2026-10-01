import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { EmptyState } from '@/components/EmptyState';
import { HeaderButtonGroup, HeaderIconButton } from '@/components/HeaderIconButton';
import { LoadingView } from '@/components/LoadingView';
import { Text } from '@/components/Text';
import { useTheme } from '@/constants/theme';
import { ClientFormSheet } from '@/features/clients/ClientFormSheet';
import { useClient, useDeleteClient } from '@/features/clients/hooks';
import { InfoRow } from '@/features/clients/InfoRow';
import { errorMessage } from '@/lib/api/errors';
import { useCoordinatorStore } from '@/stores/coordinator-store';

/** Port of ClientView. */
export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { data: client, isPending, isError, error, refetch } = useClient(id);
  const remove = useDeleteClient();
  const [showEdit, setShowEdit] = useState(false);

  const viewInvoices = () => {
    if (!client) return;
    useCoordinatorStore.getState().setPendingInvoiceSearchToken({ tag: 'client', value: client.id, label: client.name });
    router.navigate('/invoices');
  };

  const confirmDelete = () => {
    if (!client) return;
    Alert.alert('Delete Client', 'Are you sure you want to delete this client?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove.mutateAsync(client.id);
            router.back();
          } catch (e) {
            Alert.alert('Delete Failed', errorMessage(e), [{ text: 'OK', style: 'cancel' }]);
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () =>
            client ? (
              <HeaderButtonGroup>
                <HeaderIconButton
                  sf="document.badge.ellipsis"
                  accessibilityLabel="View invoices"
                  testID="client-view-invoices"
                  onPress={viewInvoices}
                />
                <HeaderIconButton
                  sf="square.and.pencil"
                  accessibilityLabel="Edit client"
                  testID="client-edit"
                  onPress={() => setShowEdit(true)}
                />
                <HeaderIconButton
                  sf="trash"
                  color={colors.red}
                  accessibilityLabel="Delete client"
                  testID="client-delete"
                  loading={remove.isPending}
                  onPress={confirmDelete}
                />
              </HeaderButtonGroup>
            ) : null,
        }}
      />
      {client ? (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{ padding: 16, gap: 16 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Avatar name={client.name} size={42} />
            <Text variant="title3" weight="700" style={{ flex: 1 }}>
              {client.name}
            </Text>
          </View>
          <View style={{ height: 0.5, backgroundColor: colors.separator }} />
          <View style={{ gap: 12 }}>
            <InfoRow icon="envelope" label="Email" value={client.email} />
            <InfoRow icon="phone" label="Phone" value={client.phone} />
            <InfoRow icon="house" label="Address" value={client.address} />
            <InfoRow icon="building.2" label="City" value={client.city} />
            <InfoRow icon="globe" label="Country" value={client.country} />
            <InfoRow icon="text.document" label="Notes" value={client.note ?? ''} />
          </View>
          <ClientFormSheet visible={showEdit} mode={{ type: 'edit', client }} onClose={() => setShowEdit(false)} />
        </ScrollView>
      ) : isPending ? (
        <LoadingView />
      ) : (
        <EmptyState
          icon="person.crop.circle.badge.xmark"
          title="Client Unavailable"
          description={isError ? errorMessage(error) : undefined}
          actionLabel="Try Again"
          onAction={() => refetch()}
          style={{ flex: 1 }}
        />
      )}
    </>
  );
}
