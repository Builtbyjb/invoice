import { Pressable, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import type { SFName } from '@/constants/icons';
import { useTheme } from '@/constants/theme';
import { formatRelative } from '@/lib/format';
import type { AppNotification } from '@/schemas/notification';

const ICONS: Record<AppNotification['kind'], SFName> = {
  client: 'person.fill',
  invoice: 'doc.text.fill',
  system: 'bell.fill',
};

export function NotificationRow({ notification, onPress }: { notification: AppNotification; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      testID={`notification-${notification.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${notification.isRead ? '' : 'Unread. '}${notification.title}. ${notification.body}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: pressed ? colors.gray5 : 'transparent',
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.tertiaryBackground,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sf={ICONS[notification.kind]} size={18} color={colors.secondaryLabel} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="subheadline" weight="600">
          {notification.title}
        </Text>
        <Text variant="subheadline" secondary numberOfLines={2}>
          {notification.body}
        </Text>
        <Text variant="caption" secondary>
          {formatRelative(notification.createdAt)}
        </Text>
      </View>
      {!notification.isRead ? (
        <View testID={`notification-${notification.id}-unread`} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.blue }} />
      ) : null}
    </Pressable>
  );
}
