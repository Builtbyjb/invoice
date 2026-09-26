import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassButton } from '@/components/GlassButton';
import { Text } from '@/components/Text';
import { useTheme } from '@/constants/theme';

/** Port of AuthView. */
export default function WelcomeScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.background, paddingBottom: 16 }}>
      <Text variant="largeTitle" weight="700">
        Invoice
      </Text>
      <View style={{ flex: 1 }} />

      <GlassButton title="Create an account" prominent onPress={() => router.push('/sign-up')} testID="welcome-sign-up" />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          maxWidth: 350,
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: colors.gray }} />
        <Text variant="subheadline" color={colors.gray} style={{ paddingHorizontal: 12 }}>
          or
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.gray }} />
      </View>

      <GlassButton title="Sign In" onPress={() => router.push('/sign-in')} testID="welcome-sign-in" />
    </SafeAreaView>
  );
}
