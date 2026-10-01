import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

/** Refetch when the screen regains focus (skips the first focus). Mirrors SwiftUI `.task` re-running on appear. */
export function useRefreshOnFocus(refetch: () => unknown) {
    const firstTime = useRef(true);
    const latest = useRef(refetch);
    useEffect(() => {
        latest.current = refetch;
    }, [refetch]);

    useFocusEffect(
        useCallback(() => {
            if (firstTime.current) {
                firstTime.current = false;
                return;
            }
            latest.current();
        }, []),
    );
}
