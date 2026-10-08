import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';

import { EmptyState } from '../../../../../components/EmptyState';
import { HeaderButtonGroup, HeaderIconButton } from '../../../../../components/HeaderIconButton';
import { LoadingView } from '../../../../../components/LoadingView';
import { useTheme } from '../../../../../constants/theme';
import { useDeleteInvoice, useInvoice } from '../../../../../features/invoices/hooks';
import { InvoiceDetail } from '../../../../../features/invoices/InvoiceDetail';
import { generateInvoicePdf, shareInvoicePdf } from '../../../../../features/invoices/pdf/generate';
import { PdfPreviewModal } from '../../../../../features/invoices/pdf/PdfPreviewModal';
import { errorMessage } from '../../../../../lib/api/errors';
import type { Invoice } from '../../../../../schemas/invoice';

type PdfAction = 'preview' | 'share';

/** Port of InvoiceView. */
export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { data: invoice, isPending, isError, error, refetch } = useInvoice(id);
  const remove = useDeleteInvoice();
  const [generating, setGenerating] = useState<PdfAction | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const runPdf = async (inv: Invoice, action: PdfAction) => {
    setGenerating(action);
    try {
      const uri = await generateInvoicePdf(inv);
      // Android's WebView can't render PDFs: fall back to sharing.
      if (action === 'preview' && Platform.OS === 'ios') setPreviewUri(uri);
      else await shareInvoicePdf(inv, uri);
    } catch (e) {
      Alert.alert('PDF Failed', errorMessage(e), [{ text: 'OK', style: 'cancel' }]);
    } finally {
      setGenerating(null);
    }
  };

  const confirmDelete = (inv: Invoice) => {
    Alert.alert('Delete Invoice', 'Are you sure you want to delete this invoice?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove.mutateAsync(inv.id);
            router.back();
          } catch (e) {
            Alert.alert('Delete Failed', errorMessage(e), [{ text: 'OK', style: 'cancel' }]);
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: invoice?.invoiceNumber ?? '',
          headerLargeTitle: false,
          headerRight: () =>
            invoice ? (
              <HeaderButtonGroup>
                <HeaderIconButton
                  sf="eye.circle"
                  accessibilityLabel="Preview PDF"
                  testID="invoice-preview"
                  loading={generating === 'preview'}
                  disabled={generating !== null}
                  onPress={() => runPdf(invoice, 'preview')}
                />
                <HeaderIconButton
                  sf="square.and.arrow.down"
                  accessibilityLabel="Share PDF"
                  testID="invoice-share"
                  loading={generating === 'share'}
                  disabled={generating !== null}
                  onPress={() => runPdf(invoice, 'share')}
                />
                <HeaderIconButton
                  sf="square.and.pencil"
                  accessibilityLabel="Edit invoice"
                  testID="invoice-edit"
                  onPress={() => router.push({ pathname: '/invoices/[id]/edit', params: { id: invoice.id } })}
                />
                <HeaderIconButton
                  sf="trash"
                  color={colors.red}
                  accessibilityLabel="Delete invoice"
                  testID="invoice-delete"
                  loading={remove.isPending}
                  onPress={() => confirmDelete(invoice)}
                />
              </HeaderButtonGroup>
            ) : null,
        }}
      />
      {invoice ? (
        <>
          <InvoiceDetail invoice={invoice} />
          <PdfPreviewModal
            uri={previewUri}
            title={invoice.invoiceNumber}
            onClose={() => setPreviewUri(null)}
            onShare={() => previewUri && shareInvoicePdf(invoice, previewUri)}
          />
        </>
      ) : isPending ? (
        <LoadingView />
      ) : (
        <EmptyState
          icon="doc.text.magnifyingglass"
          title="Invoice Unavailable"
          description={isError ? errorMessage(error) : undefined}
          actionLabel="Try Again"
          onAction={() => refetch()}
          style={{ flex: 1 }}
        />
      )}
    </>
  );
}
