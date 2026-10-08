import { Stack } from 'expo-router';

import { stackScreenOptions, tabRootOptions } from '../../../../constants/navigation';

// Deep links to /invoices/[id] always get the list underneath.
export const unstable_settings = { initialRouteName: 'index' };

export default function InvoicesLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={tabRootOptions('Invoices')} />
      <Stack.Screen name="new" options={{ title: 'New Invoice' }} />
      <Stack.Screen name="[id]/index" options={{ title: '' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Invoice' }} />
    </Stack>
  );
}
