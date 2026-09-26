import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/** Calls `onActive` whenever the app transitions back to the foreground (SwiftUI `scenePhase == .active`). */
export function useOnAppActive(onActive: () => void) {
  const callback = useRef(onActive);
  useEffect(() => {
    callback.current = onActive;
  }, [onActive]);
  useEffect(() => {
    let previous: AppStateStatus = AppState.currentState;
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active' && previous !== 'active') callback.current();
      previous = next;
    });
    return () => sub.remove();
  }, []);
}
