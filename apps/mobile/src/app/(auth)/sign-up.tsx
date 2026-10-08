import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { FormTextField } from '../../components/fields/bound';
import { useFieldError } from '../../components/fields/errors';
import { SelectField } from '../../components/fields/SelectField';
import { toOptions } from '../../components/SelectSheet';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Text } from '../../components/Text';
import { TextButton } from '../../components/TextButton';
import { countries } from '../../constants/countries';
import { useTheme } from '../../constants/theme';
import { OtpSheet } from '../../features/auth/OtpSheet';
import { useStartOtp } from '../../features/auth/useStartOtp';
import { signUp } from '../../lib/api/auth';
import { signUpFormSchema, type SignUpFormValues } from '../../schemas/auth';

import type { AnyFieldApi } from '@tanstack/react-form';

const countryOptions = toOptions(countries);

/** Port of SignUpView. */
export default function SignUpScreen() {
  const { colors } = useTheme();
  const otp = useStartOtp('Sign Up Failed');

  const defaultValues: SignUpFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    country: 'United States',
    referral: '',
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: signUpFormSchema, onSubmit: signUpFormSchema },
    onSubmit: async ({ value }) => {
      const parsed = signUpFormSchema.parse(value);
      await otp.start(parsed.email, () => signUp(parsed));
    },
  });

  return (
    <>
      <KeyboardAwareScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text weight="700" style={{ fontSize: 28, lineHeight: 34, paddingTop: 20 }}>
          Create your account
        </Text>

        <View style={{ gap: 12 }}>
          <form.Field name="firstName">
            {(field) => (
              <FormTextField
                field={field}
                testID="sign-up-first-name"
                label="First Name"
                required
                placeholder="John"
                autoComplete="given-name"
                textContentType="givenName"
              />
            )}
          </form.Field>
          <form.Field name="lastName">
            {(field) => (
              <FormTextField
                field={field}
                testID="sign-up-last-name"
                label="Last Name"
                required
                placeholder="Doe"
                autoComplete="family-name"
                textContentType="familyName"
              />
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <FormTextField
                field={field}
                testID="sign-up-email"
                label="Email Address"
                required
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
              />
            )}
          </form.Field>
          <form.Field name="businessName">
            {(field) => (
              <FormTextField
                field={field}
                testID="sign-up-business"
                label="Business Name"
                required
                placeholder="Acme Corp"
                autoComplete="organization"
                textContentType="organizationName"
              />
            )}
          </form.Field>
          <form.Field name="country">{(field) => <CountryField field={field} />}</form.Field>
          <form.Field name="referral">
            {(field) => (
              <FormTextField
                field={field}
                testID="sign-up-referral"
                label="Referral Code"
                autoCapitalize="characters"
                autoCorrect={false}
              />
            )}
          </form.Field>
        </View>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <PrimaryButton
              testID="sign-up-submit"
              title="Sign Up"
              loading={isSubmitting}
              onPress={() => form.handleSubmit()}
              style={{ marginTop: 10 }}
            />
          )}
        </form.Subscribe>

        <View style={{ alignItems: 'flex-start' }}>
          <TextButton title="Already have an account? Sign In" onPress={() => router.replace('/sign-in')} />
        </View>
      </KeyboardAwareScrollView>
      <OtpSheet visible={otp.otpVisible} onClose={otp.closeOtp} />
    </>
  );
}

function CountryField({ field }: { field: AnyFieldApi }) {
  const error = useFieldError(field);
  return (
    <SelectField
      variant="boxed"
      label="Country"
      required
      title="Select Country"
      options={countryOptions}
      value={field.state.value as string}
      onChange={(v) => {
        field.handleChange(v);
        field.handleBlur();
      }}
      searchable
      error={error}
      testID="sign-up-country"
    />
  );
}
