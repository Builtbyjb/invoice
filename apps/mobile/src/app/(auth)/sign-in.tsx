import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { FormTextField } from '../../components/fields/bound';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Text } from '../../components/Text';
import { TextButton } from '../../components/TextButton';
import { useTheme } from '../../constants/theme';
import { OtpSheet } from '../../features/auth/OtpSheet';
import { useStartOtp } from '../../features/auth/useStartOtp';
import { signIn } from '../../lib/api/auth';
import { signInFormSchema, type SignInFormValues } from '../../schemas/auth';

/** Port of LogInView. */
export default function SignInScreen() {
  const { colors } = useTheme();
  const otp = useStartOtp('Sign In Failed');

  const defaultValues: SignInFormValues = { email: '' };
  const form = useForm({
    defaultValues,
    validators: { onChange: signInFormSchema, onSubmit: signInFormSchema },
    onSubmit: async ({ value }) => {
      const { email } = signInFormSchema.parse(value);
      await otp.start(email, () => signIn(email));
    },
  });

  return (
    <>
      <KeyboardAwareScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 24, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text weight="700" style={{ fontSize: 28, lineHeight: 34, paddingTop: 20 }}>
          Sign In
        </Text>

        <form.Field name="email">
          {(field) => (
            <FormTextField
              field={field}
              testID="sign-in-email"
              label="Email Address"
              placeholder="name@example.com"
              padding={16}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="go"
              onSubmitEditing={() => form.handleSubmit()}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <PrimaryButton
              testID="sign-in-submit"
              title="Sign In"
              loading={isSubmitting}
              onPress={() => form.handleSubmit()}
              style={{ marginTop: 10 }}
            />
          )}
        </form.Subscribe>

        <View style={{ alignItems: 'flex-start' }}>
          <TextButton title="Don't have an account? Sign Up" onPress={() => router.replace('/sign-up')} />
        </View>
      </KeyboardAwareScrollView>
      <OtpSheet visible={otp.otpVisible} onClose={otp.closeOtp} />
    </>
  );
}
