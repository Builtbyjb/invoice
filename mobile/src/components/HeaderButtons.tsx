import { router } from 'expo-router';
import { View } from 'react-native';

import { useTheme } from '@/constants/theme';
import { selectHasUnread, useNotificationStore } from '@/stores/notification-store';

import { HeaderButtonGroup, HeaderIconButton } from './HeaderIconButton';

/** Port of TopBarButtons: Help, Notifications (with unread dot) and Settings. */
export function HeaderButtons() {
  const { colors } = useTheme();
  const hasUnread = useNotificationStore(selectHasUnread);
  return (
    <HeaderButtonGroup>
      <HeaderIconButton sf="questionmark.circle" accessibilityLabel="Help" onPress={() => router.push('/help')} />
      <HeaderIconButton
        sf="bell"
        accessibilityLabel={hasUnread ? 'Notifications, unread' : 'Notifications'}
        testID="header-bell"
        onPress={() => router.push('/notifications')}
      >
        {hasUnread ? (
          <View
            testID="unread-dot"
            style={{
              position: 'absolute',
              top: -2,
              right: -4,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.red,
            }}
          />
        ) : null}
      </HeaderIconButton>
      <HeaderIconButton sf="gear" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
    </HeaderButtonGroup>
  );
}
