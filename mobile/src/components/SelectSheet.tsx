import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { radii, useTheme } from '@/constants/theme';

import { Icon } from './Icon';
import { SheetHeader } from './SheetHeader';
import { Text } from './Text';
import { TextButton } from './TextButton';

export type SelectOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  visible: boolean;
  title: string;
  options: readonly SelectOption<T>[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  onClose: () => void;
  searchable?: boolean;
};

export function toOptions<T extends string>(values: readonly T[], label: (v: T) => string = (v) => v) {
  return values.map((value) => ({ value, label: label(value) }));
}

/** Modal list picker with optional search. Selecting an option closes the sheet. */
export function SelectSheet<T extends string>({
  visible,
  title,
  options,
  value,
  onChange,
  onClose,
  searchable,
}: Props<T>) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const close = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.groupedBackground }}>
        <SheetHeader title={title} left={<TextButton title="Cancel" onPress={close} />} />
        {searchable ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              margin: 16,
              marginBottom: 8,
              paddingHorizontal: 10,
              borderRadius: radii.tile,
              backgroundColor: colors.gray5,
            }}
          >
            <Icon sf="magnifyingglass" size={16} color={colors.secondaryLabel} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor={colors.secondaryLabel}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              style={{ flex: 1, paddingVertical: 9, fontSize: 17, color: colors.label }}
            />
          </View>
        ) : null}
        <FlatList
          data={filtered}
          keyExtractor={(o) => o.value}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={30}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => (
            <View style={{ height: 0.5, backgroundColor: colors.separator, marginLeft: 32 }} />
          )}
          renderItem={({ item, index }) => {
            const selected = item.value === value;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  onChange(item.value);
                  close();
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 16,
                  paddingHorizontal: 16,
                  minHeight: 44,
                  backgroundColor: pressed ? colors.gray5 : colors.groupedCell,
                  borderTopLeftRadius: index === 0 ? 10 : 0,
                  borderTopRightRadius: index === 0 ? 10 : 0,
                  borderBottomLeftRadius: index === filtered.length - 1 ? 10 : 0,
                  borderBottomRightRadius: index === filtered.length - 1 ? 10 : 0,
                })}
              >
                <Text style={{ flex: 1 }}>{item.label}</Text>
                {selected ? <Icon sf="checkmark" size={17} color={colors.blue} weight="semibold" /> : null}
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}
