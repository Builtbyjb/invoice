import { Children, Fragment, isValidElement } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/constants/theme';

import { Text } from './Text';

type Props = {
  header?: React.ReactNode;
  footer?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Inset-grouped section, like a SwiftUI `Form` `Section`. Rows are separated by hairlines. */
export function FormSection({ header, footer, children, style }: Props) {
  const { colors } = useTheme();
  const rows = Children.toArray(children).filter(isValidElement);
  return (
    <View style={[{ marginHorizontal: 16, marginTop: 20 }, style]}>
      {header ? (
        typeof header === 'string' ? (
          <Text variant="footnote" secondary style={{ marginLeft: 16, marginBottom: 6, textTransform: 'uppercase' }}>
            {header}
          </Text>
        ) : (
          <View style={{ marginLeft: 16, marginBottom: 6 }}>{header}</View>
        )
      ) : null}
      <View style={{ backgroundColor: colors.groupedCell, borderRadius: 10, overflow: 'hidden' }}>
        {rows.map((row, i) => (
          <Fragment key={row.key ?? i}>
            {i > 0 ? (
              <View style={{ height: 0.5, backgroundColor: colors.separator, marginLeft: 16 }} />
            ) : null}
            {row}
          </Fragment>
        ))}
      </View>
      {footer ? (
        <Text variant="footnote" secondary style={{ marginHorizontal: 16, marginTop: 6 }}>
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

/** A standard row inside a FormSection. */
export function FormRow({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ minHeight: 44, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center' }, style]}>
      {children}
    </View>
  );
}
