import { Stack } from 'expo-router';

import { stackScreenOptions, tabRootOptions } from '../../../../constants/navigation';

export default function ReferralLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={tabRootOptions('Referral')} />
    </Stack>
  );
}
