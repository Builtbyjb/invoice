import { LoadingView } from '@/components/LoadingView';
import { InvoiceForm } from '@/features/invoices/InvoiceForm';
import { usePreferredCurrency } from '@/hooks/usePreferredCurrency';

export default function NewInvoiceScreen() {
  const currency = usePreferredCurrency();
  if (!currency) return <LoadingView />;
  return <InvoiceForm mode={{ type: 'create' }} preferredCurrency={currency} />;
}
