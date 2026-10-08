import { useLocalSearchParams } from 'expo-router';

import { EmptyState } from '../../../../../components/EmptyState';
import { LoadingView } from '../../../../../components/LoadingView';
import { useInvoice } from '../../../../../features/invoices/hooks';
import { InvoiceForm } from '../../../../../features/invoices/InvoiceForm';
import { errorMessage } from '../../../../../lib/api/errors';

export default function EditInvoiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: invoice, isPending, error, refetch } = useInvoice(id);

  if (invoice) return <InvoiceForm key={invoice.id} mode={{ type: 'edit', invoice }} preferredCurrency={invoice.currency} />;
  if (isPending) return <LoadingView />;
  return (
    <EmptyState
      icon="doc.text.magnifyingglass"
      title="Invoice Unavailable"
      description={errorMessage(error)}
      actionLabel="Try Again"
      onAction={() => refetch()}
      style={{ flex: 1 }}
    />
  );
}
