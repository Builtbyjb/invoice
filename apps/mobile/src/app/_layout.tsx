import { QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InitLoading } from '../components/InitLoading';
import { darkColors, lightColors, useTheme } from '../constants/theme';
import { queryClient, subscribeAppFocus } from '../lib/query/query-client';
import { useAuthStore } from '../stores/auth-store';

SplashScreen.preventAutoHideAsync().catch(() => {});
subscribeAppFocus();

// Foreground presentation (Swift: willPresent → [.banner, .sound, .list, .badge]).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const navLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.blue,
    background: lightColors.background,
    card: lightColors.background,
    text: lightColors.label,
    border: lightColors.separator,
    notification: lightColors.red,
  },
};

const navDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.blue,
    background: darkColors.background,
    card: darkColors.background,
    text: darkColors.label,
    border: darkColors.separator,
    notification: darkColors.red,
  },
};

export default function RootLayout() {
  const state = useAuthStore((s) => s.state);
  const { dark } = useTheme();

  useEffect(() => {
    void useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    if (state !== 'undefined') SplashScreen.hideAsync().catch(() => {});
  }, [state]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={dark ? navDark : navLight}>
              <StatusBar style="auto" />
              {state === 'undefined' ? (
                <InitLoading />
              ) : (
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Protected guard={state === 'authenticated'}>
                    <Stack.Screen name="(app)" />
                  </Stack.Protected>
                  <Stack.Protected guard={state !== 'authenticated'}>
                    <Stack.Screen name="(auth)" />
                  </Stack.Protected>
                </Stack>
              )}
            </ThemeProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
