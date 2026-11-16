import { Stack } from 'expo-router';

import { usePushNotifications } from '../../features/notifications/usePushNotifications';

/**
 * Screens pushed over the tabs (hiding the tab bar), like Swift's `.toolbar(.hidden, for: .tabBar)`.
 * Back returns to the tab you came from.
 */
export default function AppLayout() {
  usePushNotifications();
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="help" options={{ title: 'Help' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
      <Stack.Screen name="settings/account" options={{ title: 'Account' }} />
      <Stack.Screen name="settings/payment" options={{ title: 'Payment' }} />
      <Stack.Screen name="settings/legal" options={{ title: 'Legal' }} />
      <Stack.Screen name="settings/subscriptions" options={{ title: 'Subscriptions' }} />
    </Stack>
  );
}
