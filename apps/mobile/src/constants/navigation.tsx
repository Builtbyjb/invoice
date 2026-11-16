import type { NativeStackNavigationOptions } from 'expo-router';

import { HeaderButtons } from '../components/HeaderButtons';

/** Options for each tab's root screen: large title + Help/Notifications/Settings on the right. */
export const tabRootOptions = (title: string): NativeStackNavigationOptions => ({
  title,
  headerLargeTitle: true,
  headerRight: () => <HeaderButtons />,
});

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerBackButtonDisplayMode: 'minimal',
};
