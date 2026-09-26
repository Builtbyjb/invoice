import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import type { Invoice } from '@/schemas/invoice';

import { buildInvoiceHtml } from './invoice-html';

/** "{clientName}-{invoiceNumber}.pdf" with characters that are invalid in file names replaced. */
export const pdfFileName = (invoice: Pick<Invoice, 'clientName' | 'invoiceNumber'>) =>
  `${invoice.clientName}-${invoice.invoiceNumber}`.replace(/[\\/:*?"<>|]/g, '_') + '.pdf';

/** Renders the invoice to a PDF in the cache directory and returns its file URI. */
export async function generateInvoicePdf(invoice: Invoice): Promise<string> {
  const { uri } = await Print.printToFileAsync({ html: buildInvoiceHtml(invoice), width: 612, height: 792 });
  const source = new File(uri);
  const destination = new File(Paths.cache, pdfFileName(invoice));
  if (destination.exists) destination.delete();
  await source.move(destination);
  return destination.uri;
}

export async function shareInvoicePdf(invoice: Invoice, uri: string): Promise<void> {
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: invoice.invoiceNumber,
  });
}
