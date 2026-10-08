import { Stack } from 'expo-router';

import { stackScreenOptions, tabRootOptions } from '../../../../constants/navigation';

// Deep links to /clients/[id] always get the list underneath.
export const unstable_settings = { initialRouteName: 'index' };

export default function ClientsLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={tabRootOptions('Clients')} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
