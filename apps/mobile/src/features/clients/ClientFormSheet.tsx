import { useForm } from '@tanstack/react-form';
import { Alert, Modal, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { FormInlineIconTextField } from '../../components/fields/bound';
import { useSchemaValid } from '../../components/fields/useSchemaValid';
import { FormSection } from '../../components/FormSection';
import { HeaderIconButton } from '../../components/HeaderIconButton';
import { SheetHeader } from '../../components/SheetHeader';
import { useTheme } from '../../constants/theme';
import { errorMessage } from '../../lib/api/errors';
import { clientFormSchema, toClientFormValues, type Client } from '../../schemas/client';

import { useCreateClient, useUpdateClient } from './hooks';

export type ClientFormMode = { type: 'create' } | { type: 'edit'; client: Client };

type Props = {
  visible: boolean;
  mode: ClientFormMode;
  onClose: () => void;
  onSaved?: (client: Client) => void;
};

/** Port of CreateClientView, presented as a page sheet. */
export function ClientFormSheet({ visible, mode, onClose, onSaved }: Props) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      {visible ? <ClientForm mode={mode} onClose={onClose} onSaved={onSaved} /> : null}
    </Modal>
  );
}

function ClientForm({ mode, onClose, onSaved }: Omit<Props, 'visible'>) {
  const { colors } = useTheme();
  const create = useCreateClient();
  const update = useUpdateClient();

  const form = useForm({
    defaultValues: toClientFormValues(mode.type === 'edit' ? mode.client : null),
    validators: { onChange: clientFormSchema, onSubmit: clientFormSchema },
    onSubmit: async ({ value }) => {
      const parsed = clientFormSchema.parse(value);
      try {
        const saved =
          mode.type === 'create'
            ? await create.mutateAsync(parsed)
            : await update.mutateAsync({ id: mode.client.id, values: parsed });
        onSaved?.(saved);
        onClose();
      } catch (e) {
        Alert.alert('Save Failed', errorMessage(e), [{ text: 'OK', style: 'cancel' }]);
      }
    },
  });

  const isValid = useSchemaValid(form, clientFormSchema);

  return (
    <View style={{ flex: 1, backgroundColor: colors.groupedBackground }}>
      <SheetHeader
        title={mode.type === 'create' ? 'New Client' : 'Edit Client'}
        left={<HeaderIconButton sf="xmark" accessibilityLabel="Cancel" testID="client-form-cancel" onPress={onClose} />}
        right={
          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <HeaderIconButton
                sf="checkmark"
                accessibilityLabel="Save"
                testID="client-form-save"
                color={colors.blue}
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                onPress={() => form.handleSubmit()}
              />
            )}
          </form.Subscribe>
        }
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>
        <FormSection header="Contact Information">
          <form.Field name="name">
            {(field) => (
              <FormInlineIconTextField
                field={field}
                icon="person.fill"
                placeholder="Name"
                autoCapitalize="words"
                testID="client-name"
              />
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <FormInlineIconTextField
                field={field}
                icon="envelope.fill"
                placeholder="Email"
                keyboardType="email-address"
                autoComplete="email"
                autoCorrect={false}
                testID="client-email"
              />
            )}
          </form.Field>
          <form.Field name="phone">
            {(field) => (
              <FormInlineIconTextField
                field={field}
                icon="phone.fill"
                placeholder="Phone Number"
                keyboardType="phone-pad"
                autoComplete="tel"
                testID="client-phone"
              />
            )}
          </form.Field>
        </FormSection>

        <FormSection header="Address">
          <form.Field name="address">
            {(field) => (
              <FormInlineIconTextField field={field} icon="house.fill" placeholder="Street Address" testID="client-address" />
            )}
          </form.Field>
          <form.Field name="city">
            {(field) => (
              <FormInlineIconTextField field={field} icon="building.2.fill" placeholder="City" testID="client-city" />
            )}
          </form.Field>
          <form.Field name="country">
            {(field) => (
              <FormInlineIconTextField field={field} icon="globe" placeholder="Country" testID="client-country" />
            )}
          </form.Field>
        </FormSection>

        <FormSection header="Notes">
          <form.Field name="note">
            {(field) => (
              <TextInput
                testID="client-note"
                accessibilityLabel="Notes"
                multiline
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                style={{
                  minHeight: 100,
                  padding: 16,
                  fontSize: 17,
                  color: colors.label,
                  textAlignVertical: 'top',
                }}
              />
            )}
          </form.Field>
        </FormSection>
      </KeyboardAwareScrollView>
    </View>
  );
}
