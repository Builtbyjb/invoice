import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/** Refetch when the screen regains focus (skips the first focus). Mirrors SwiftUI `.task` re-running on appear. */
export function useRefreshOnFocus(refetch: () => unknown) {
  const firstTime = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstTime.current) {
        firstTime.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );
}
