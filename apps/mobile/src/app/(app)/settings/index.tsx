import * as Application from 'expo-application';
import { router, type Href } from 'expo-router';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { FormSection } from '../../../components/FormSection';
import { Icon } from '../../../components/Icon';
import { Text } from '../../../components/Text';
import type { SFName } from '../../../constants/icons';
import { useTheme } from '../../../constants/theme';
import { useAuthStore } from '../../../stores/auth-store';

const ROWS: { title: string; icon: SFName; href: Href }[] = [
  { title: 'Account', icon: 'person.fill', href: '/settings/account' },
  { title: 'Payment', icon: 'creditcard.fill', href: '/settings/payment' },
  { title: 'Legal', icon: 'doc.text.fill', href: '/settings/legal' },
  { title: 'Subscriptions', icon: 'crown.fill', href: '/settings/subscriptions' },
];

/** Port of SettingView. */
export default function SettingsScreen() {
  const { colors } = useTheme();

  const confirmSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => useAuthStore.getState().signOut() },
    ]);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.groupedBackground }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <FormSection header="Account">
        {ROWS.map((row) => (
          <Pressable
            key={row.title}
            accessibilityRole="button"
            onPress={() => router.push(row.href)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              minHeight: 44,
              paddingHorizontal: 16,
              backgroundColor: pressed ? colors.gray5 : 'transparent',
            })}
          >
            <View style={{ width: 24, alignItems: 'center' }}>
              <Icon sf={row.icon} size={18} color={colors.blue} />
            </View>
            <Text style={{ flex: 1 }}>{row.title}</Text>
            <Icon sf="chevron.right" size={13} color={colors.tertiaryLabel} weight="semibold" />
          </Pressable>
        ))}
      </FormSection>

      <FormSection footer={`Version ${Application.nativeApplicationVersion ?? '0.1.0'}`}>
        <Pressable
          testID="sign-out"
          accessibilityRole="button"
          onPress={confirmSignOut}
          style={({ pressed }) => ({
            minHeight: 44,
            paddingHorizontal: 16,
            justifyContent: 'center',
            backgroundColor: pressed ? colors.gray5 : 'transparent',
          })}
        >
          <Text color={colors.red}>Sign Out</Text>
        </Pressable>
      </FormSection>
    </ScrollView>
  );
}
