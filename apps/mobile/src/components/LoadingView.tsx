import { ActivityIndicator, View } from 'react-native';

/** Port of DefaultLoadingView. */
export function LoadingView() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}
