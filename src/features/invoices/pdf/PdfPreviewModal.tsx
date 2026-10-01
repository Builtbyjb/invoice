import { Modal, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { HeaderIconButton } from '@/components/HeaderIconButton';
import { SheetHeader } from '@/components/SheetHeader';
import { TextButton } from '@/components/TextButton';
import { useTheme } from '@/constants/theme';

type Props = {
  uri: string | null;
  title: string;
  onClose: () => void;
  onShare: () => void;
};

/** Replaces QLPreviewController: WKWebView renders PDFs natively on iOS. */
export function PdfPreviewModal({ uri, title, onClose, onShare }: Props) {
  const { colors } = useTheme();
  return (
    <Modal visible={uri !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SheetHeader
          title={title}
          left={<TextButton title="Done" weight="600" onPress={onClose} testID="pdf-done" />}
          right={<HeaderIconButton sf="square.and.arrow.up" accessibilityLabel="Share PDF" onPress={onShare} />}
        />
        {uri ? (
          <WebView
            source={{ uri }}
            originWhitelist={['*']}
            allowFileAccess
            allowingReadAccessToURL={uri}
            style={{ flex: 1, backgroundColor: colors.secondaryBackground }}
          />
        ) : null}
      </View>
    </Modal>
  );
}
