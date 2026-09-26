import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, View } from 'react-native';

import { TextButton } from '@/components/TextButton';
import { useTheme } from '@/constants/theme';
import { openDeepLink } from '@/features/notifications/deep-link';
import { NotificationRow } from '@/features/notifications/NotificationRow';
import type { AppNotification } from '@/schemas/notification';
import { selectHasUnread, useNotificationStore } from '@/stores/notification-store';

/** Port of NotificationView. */
export default function NotificationsScreen() {
  const { colors } = useTheme();
  const notifications = useNotificationStore((s) => s.notifications);
  const hasUnread = useNotificationStore(selectHasUnread);

  useEffect(() => {
    void useNotificationStore.getState().refresh();
  }, []);

  const onPress = async (n: AppNotification) => {
    await useNotificationStore.getState().markRead(n.id);
    if (n.targetId && n.kind !== 'system') openDeepLink({ type: n.kind, id: n.targetId });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TextButton
              title="Mark All Read"
              testID="mark-all-read"
              disabled={!hasUnread}
              onPress={() => useNotificationStore.getState().markAllRead()}
            />
          ),
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: colors.background }}
        data={notifications}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => <NotificationRow notification={item} onPress={() => onPress(item)} />}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: colors.separator, marginLeft: 68 }} />}
      />
    </>
  );
}
