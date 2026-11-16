import { View } from 'react-native';

import { Icon } from '../../components/Icon';
import { ListCard } from '../../components/ListCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Text } from '../../components/Text';
import { useTheme } from '../../constants/theme';
import { formatCurrency, formatDateLong } from '../../lib/format';
import { computeTotals } from '../../lib/invoice-math';
import type { Invoice } from '../../schemas/invoice';

/** Port of InvoiceListCard. */
export function InvoiceListCard({ invoice, onPress }: { invoice: Invoice; onPress: () => void }) {
  const { colors } = useTheme();
  const { grandTotal } = computeTotals(invoice.items, invoice.discount, invoice.taxRate);
  return (
    <ListCard onPress={onPress} accessibilityLabel={`${invoice.invoiceNumber}, ${invoice.clientName}`} testID={`invoice-card-${invoice.id}`}>
      <View style={{ flex: 1, gap: 8 }}>
        <Text variant="subheadline">{invoice.invoiceNumber}</Text>
        <Text variant="subheadline" secondary>
          {invoice.clientName}
        </Text>
        <View style={{ gap: 6 }}>
          <Text variant="headline">{formatCurrency(grandTotal, invoice.currency)}</Text>
          <Text variant="caption" secondary>
            Due {formatDateLong(invoice.dueDate)}
          </Text>
        </View>
      </View>
      <StatusBadge status={invoice.status} />
      <Icon sf="chevron.right" size={12} color={colors.secondaryLabel} weight="semibold" style={{ marginLeft: 16 }} />
    </ListCard>
  );
}
