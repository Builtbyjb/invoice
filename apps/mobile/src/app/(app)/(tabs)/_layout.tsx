import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTheme } from '../../../constants/theme';

/** Port of ContentView's TabView. Each tab folder has its own Stack. */
export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <NativeTabs tintColor={colors.blue}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="clients">
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
        <NativeTabs.Trigger.Label>Clients</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="invoices">
        <NativeTabs.Trigger.Icon sf={{ default: 'doc.text', selected: 'doc.text.fill' }} md="description" />
        <NativeTabs.Trigger.Label>Invoices</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="referral">
        <NativeTabs.Trigger.Icon sf={{ default: 'gift', selected: 'gift.fill' }} md="redeem" />
        <NativeTabs.Trigger.Label>Referral</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
