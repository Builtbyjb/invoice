// TEMPORARY component gallery (step 3 acceptance). Deleted in step 11.
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { FormRow, FormSection } from '@/components/FormSection';
import { HeaderButtonGroup, HeaderIconButton } from '@/components/HeaderIconButton';
import { Icon } from '@/components/Icon';
import { IconTile } from '@/components/IconTile';
import { InitLoading } from '@/components/InitLoading';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SelectSheet, toOptions } from '@/components/SelectSheet';
import { StatusBadge } from '@/components/StatusBadge';
import { Text } from '@/components/Text';
import { countries } from '@/constants/countries';
import { useTheme } from '@/constants/theme';

export default function Gallery() {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState('United States');
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 12, paddingTop: 60 }}>
      <View style={{ height: 60 }}>
        <InitLoading />
      </View>
      <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Avatar name="Acme" />
        <Avatar name="globex" size={42} />
        <IconTile sf="checkmark.circle.fill" color={colors.green} />
        <IconTile sf="exclamationmark.triangle.fill" color={colors.red} />
        <Icon sf="house.fill" size={24} color={colors.blue} />
      </Card>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <StatusBadge status="draft" />
        <StatusBadge status="sent" />
        <StatusBadge status="paid" />
        <StatusBadge status="overdue" />
      </View>
      <HeaderButtonGroup>
        <HeaderIconButton sf="questionmark.circle" onPress={() => {}} />
        <HeaderIconButton sf="bell" onPress={() => {}} />
        <HeaderIconButton sf="gear" onPress={() => {}} />
        <HeaderIconButton sf="checkmark" onPress={() => {}} loading />
      </HeaderButtonGroup>
      <PrimaryButton title="Sign In" onPress={() => setOpen(true)} />
      <PrimaryButton title="Loading" onPress={() => {}} loading />
      <PrimaryButton title="Disabled" onPress={() => {}} disabled />
      <View style={{ marginHorizontal: -16 }}>
        <FormSection header="Contact Information">
          <FormRow>
            <Text>Country: {country}</Text>
          </FormRow>
          <FormRow>
            <Text secondary>Second row</Text>
          </FormRow>
        </FormSection>
      </View>
      <EmptyState icon="person.crop.circle.badge.xmark" title="No Clients" description="Add your first client using the + button above." />
      <SelectSheet
        visible={open}
        title="Country"
        options={toOptions(countries)}
        value={country}
        onChange={setCountry}
        onClose={() => setOpen(false)}
        searchable
      />
    </ScrollView>
  );
}
