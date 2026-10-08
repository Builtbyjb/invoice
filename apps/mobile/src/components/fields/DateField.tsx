import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, View } from 'react-native';

import { useTheme } from '../../constants/theme';
import { formatDateAbbrev } from '../../lib/format';

import { Text } from '../Text';
import { FieldError } from './FieldError';

type Props = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  testID?: string;
};

/** Label on the left, compact date picker on the right (SwiftUI DatePicker `.compact`, date only). */
export function DateField({ label, value, onChange, error, testID }: Props) {
  const { colors, dark } = useTheme();

  const handleChange = (_: unknown, date?: Date) => {
    if (date) onChange(date);
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 32 }}>
        <Text style={{ flex: 1 }}>{label}</Text>
        {Platform.OS === 'ios' ? (
          <DateTimePicker
            testID={testID}
            value={value}
            mode="date"
            display="compact"
            onValueChange={handleChange}
            accessibilityLabel={label}
            themeVariant={dark ? 'dark' : 'light'}
          />
        ) : (
          <Pressable
            testID={testID}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${formatDateAbbrev(value)}`}
            onPress={() => DateTimePickerAndroid.open({ value, mode: 'date', onValueChange: handleChange })}
            style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: colors.fill }}
          >
            <Text>{formatDateAbbrev(value)}</Text>
          </Pressable>
        )}
      </View>
      <FieldError message={error} />
    </View>
  );
}
