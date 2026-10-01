import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Pressable, TextInput, View, type ViewStyle } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, withAlpha } from '@/constants/theme';
import type { SearchToken } from '@/stores/coordinator-store';

import { Icon } from './Icon';
import { Text } from './Text';

type Props = {
  text: string;
  onChangeText: (text: string) => void;
  token?: SearchToken | null;
  onClearToken?: () => void;
  onClose: () => void;
  placeholder?: string;
};

function Surface({ style, children }: { style: ViewStyle; children: React.ReactNode }) {
  const { colors } = useTheme();
  const shared: ViewStyle = {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  };
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView glassEffectStyle="regular" style={[shared, style]}>
        {children}
      </GlassView>
    );
  }
  return <View style={[shared, { backgroundColor: colors.secondaryBackground, elevation: 4 }, style]}>{children}</View>;
}

/** Port of SearchBarView: a floating pill at the bottom of the list, above the keyboard. */
export function FloatingSearchBar({ text, onChangeText, token, onClearToken, onClose, placeholder = 'Search' }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardStickyView
      offset={{ closed: 0, opened: insets.bottom - 8 }}
      style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 8 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
        <Surface style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, minHeight: 52 }}>
          <Icon sf="magnifyingglass" size={17} color={colors.secondaryLabel} />
          {token ? (
            <View
              testID="search-token"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: withAlpha(colors.blue, 0.15),
              }}
            >
              <Text variant="subheadline" secondary>
                {token.tag}
              </Text>
              <Text variant="subheadline" numberOfLines={1} style={{ maxWidth: 120 }}>
                {token.label}
              </Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Remove filter" hitSlop={8} onPress={onClearToken}>
                <Icon sf="xmark.circle.fill" size={16} color={colors.secondaryLabel} />
              </Pressable>
            </View>
          ) : null}
          <TextInput
            testID="search-input"
            value={text}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.secondaryLabel}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            style={{ flex: 1, fontSize: 17, color: colors.label, paddingVertical: 14 }}
          />
          {text !== '' ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear text" hitSlop={8} onPress={() => onChangeText('')}>
              <Icon sf="xmark.circle.fill" size={17} color={colors.secondaryLabel} />
            </Pressable>
          ) : null}
        </Surface>
        <Pressable accessibilityRole="button" accessibilityLabel="Close search" testID="search-close" onPress={onClose}>
          <Surface style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}>
            <Icon sf="xmark" size={17} color={colors.label} />
          </Surface>
        </Pressable>
      </View>
    </KeyboardStickyView>
  );
}
