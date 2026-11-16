import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { radii, useTheme } from '../../constants/theme';

import { Icon } from '../Icon';
import { SelectSheet, type SelectOption } from '../SelectSheet';
import { Text } from '../Text';
import { FieldError } from './FieldError';

type Props<T extends string> = {
  /** Sheet title, and the row label in `row` variant. */
  title: string;
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  searchable?: boolean;
  error?: string;
  /**
   * `boxed`: gray6 box below a label (sign-up Country).
   * `row`: "Label ........ Value ⌄" row inside a FormSection (invoice Status/Currency).
   */
  variant?: 'boxed' | 'row';
  label?: string;
  required?: boolean;
  testID?: string;
};

export function SelectField<T extends string>({
  title,
  options,
  value,
  onChange,
  searchable,
  error,
  variant = 'row',
  label,
  required,
  testID,
}: Props<T>) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  const sheet = (
    <SelectSheet
      visible={open}
      title={title}
      options={options}
      value={value}
      onChange={onChange}
      onClose={() => setOpen(false)}
      searchable={searchable}
    />
  );

  if (variant === 'boxed') {
    return (
      <View style={{ gap: 4 }}>
        {label ? (
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Text variant="footnote" weight="600" color={colors.gray}>
              {label}
            </Text>
            {required ? (
              <Text variant="footnote" weight="600" color={colors.red}>
                *
              </Text>
            ) : null}
          </View>
        ) : null}
        <Pressable
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={`${label ?? title}: ${selectedLabel}`}
          onPress={() => setOpen(true)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            padding: 12,
            borderRadius: radii.input,
            backgroundColor: colors.fill,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text color={colors.blue} style={{ flexShrink: 1 }}>
            {selectedLabel}
          </Text>
          <Icon sf="chevron.down" size={12} color={colors.blue} weight="semibold" />
        </Pressable>
        <FieldError message={error} />
        {sheet}
      </View>
    );
  }

  return (
    <View>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${selectedLabel}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 44,
          paddingHorizontal: 16,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text style={{ flex: 1 }}>{title}</Text>
        <Text secondary>{selectedLabel}</Text>
        <Icon sf="chevron.down" size={12} color={colors.secondaryLabel} weight="semibold" style={{ marginLeft: 6 }} />
      </Pressable>
      {error ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <FieldError message={error} />
        </View>
      ) : null}
      {sheet}
    </View>
  );
}
