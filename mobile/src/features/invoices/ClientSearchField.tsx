import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { radii, useTheme } from '@/constants/theme';
import { useClientSearch } from '@/features/clients/hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { InvoiceClient } from '@/schemas/invoice';

type Props = {
  selection: InvoiceClient | null;
  onSelect: (client: InvoiceClient | null) => void;
  autoFocus?: boolean;
};

/** Port of SearchDropdownView<Client>, with an inline results panel instead of a popover. */
export function ClientSearchField({ selection, onSelect, autoFocus }: Props) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState(selection?.name ?? '');
  const [focused, setFocused] = useState(false);
  const selectingRef = useRef(false);

  // Keep the text in sync when the selection changes from outside (e.g. a client created inline).
  const [syncedId, setSyncedId] = useState(selection?.id ?? null);
  if ((selection?.id ?? null) !== syncedId) {
    setSyncedId(selection?.id ?? null);
    if (selection) setQuery(selection.name);
  }

  // Search immediately on focus with the current query, then debounce typing by 300 ms.
  const [focusQuery, setFocusQuery] = useState<string | null>(null);
  const debounced = useDebouncedValue(query, 300);
  const effectiveQuery = focusQuery ?? debounced;
  const { data, isFetching } = useClientSearch(effectiveQuery, focused);
  const results = data ?? [];

  const select = (client: InvoiceClient) => {
    selectingRef.current = true;
    onSelect(client);
    setQuery(client.name);
    setFocused(false);
    inputRef.current?.blur();
  };

  const clear = () => {
    onSelect(null);
    setQuery('');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <TextInput
          ref={inputRef}
          testID="client-search-input"
          value={query}
          onChangeText={(t) => {
            setFocusQuery(null);
            setQuery(t);
          }}
          onFocus={() => {
            setFocused(true);
            setFocusQuery(query);
          }}
          onBlur={() => {
            setFocused(false);
            setFocusQuery(null);
            // On blur without selecting, reset the text to the current selection.
            if (!selectingRef.current) setQuery(selection?.name ?? '');
            selectingRef.current = false;
          }}
          autoFocus={autoFocus}
          placeholder="Search for a client by name"
          placeholderTextColor={colors.tertiaryLabel}
          autoCapitalize="none"
          autoCorrect={false}
          textAlign="right"
          accessibilityLabel="Search for a client by name"
          style={{ flex: 1, fontSize: 17, color: colors.label, paddingVertical: 4 }}
        />
        {query !== '' ? (
          <Pressable testID="client-search-clear" accessibilityRole="button" accessibilityLabel="Clear client" hitSlop={8} onPress={clear}>
            <Icon sf="xmark.circle.fill" size={17} color={colors.secondaryLabel} />
          </Pressable>
        ) : null}
      </View>

      {focused ? (
        <View
          testID="client-search-results"
          style={{
            marginTop: 8,
            maxHeight: 240,
            borderRadius: radii.inner,
            backgroundColor: colors.tertiaryBackground,
            borderWidth: 0.5,
            borderColor: colors.separator,
            overflow: 'hidden',
          }}
        >
          {isFetching && results.length === 0 ? (
            <View style={{ paddingVertical: 12, alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          ) : results.length === 0 ? (
            <Text variant="subheadline" secondary align="center" style={{ paddingVertical: 12 }}>
              {effectiveQuery === '' ? 'No items' : `No results for "${effectiveQuery}"`}
            </Text>
          ) : (
            <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled>
              {results.map((client) => (
                <Pressable
                  key={client.id}
                  testID={`client-option-${client.id}`}
                  accessibilityRole="button"
                  onPress={() => select({ id: client.id, name: client.name, email: client.email })}
                  style={({ pressed }) => ({
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    gap: 2,
                    backgroundColor: pressed ? colors.gray5 : 'transparent',
                  })}
                >
                  <Text>{client.name}</Text>
                  <Text variant="caption" secondary>
                    {client.email}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      ) : null}
    </View>
  );
}
