import { View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { ListCard } from '@/components/ListCard';
import { Text } from '@/components/Text';
import { useTheme } from '@/constants/theme';
import type { Client } from '@/schemas/client';

/** "{city}, {country}" without a dangling comma when either is empty (rewrite plan §6 #15). */
export const cityCountry = (city: string, country: string) =>
  [city.trim(), country.trim()].filter(Boolean).join(', ');

/** Port of ClientCard. */
export function ClientCard({ client, onPress }: { client: Client; onPress: () => void }) {
  const { colors } = useTheme();
  const location = cityCountry(client.city, client.country);
  return (
    <ListCard onPress={onPress} accessibilityLabel={client.name} testID={`client-card-${client.id}`}>
      <Avatar name={client.name} size={48} />
      <View style={{ flex: 1, gap: 4, marginLeft: 16 }}>
        <Text variant="headline">{client.name}</Text>
        <Text variant="subheadline" secondary numberOfLines={1}>
          {client.email !== '' ? client.email : client.phone}
        </Text>
        {location ? (
          <Text variant="caption" secondary>
            {location}
          </Text>
        ) : null}
      </View>
      <Icon sf="chevron.right" size={12} color={colors.secondaryLabel} weight="semibold" style={{ marginLeft: 8 }} />
    </ListCard>
  );
}
