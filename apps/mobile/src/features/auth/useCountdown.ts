import { useCallback, useEffect, useState } from "react";

/** Counts down once per second from `seconds` to 0 (starts on mount). `restart()` starts again from the top. */
export function useCountdown(seconds: number) {
    const [deadline, setDeadline] = useState(() => Date.now() + seconds * 1000);
    const [now, setNow] = useState(() => Date.now());
    const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
    const active = remaining > 0;

    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [active, deadline]);

    const restart = useCallback(() => {
        const t = Date.now();
        setNow(t);
        setDeadline(t + seconds * 1000);
    }, [seconds]);

    return { remaining, active, restart };
}

/** "MM:SS" (Swift `%02d:%02d`). */
export const formatCountdown = (total: number) =>
    `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
