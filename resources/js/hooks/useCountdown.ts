import { useEffect, useState } from 'react';

export interface CountdownResult {
    remainingMs: number;
    isComplete: boolean;
    formatted: string; // MM:SS
}

function formatDuration(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Re-derives remaining time from a server-controlled ISO timestamp on every tick —
 * never decrements a local counter. Safe against tab backgrounding, refresh, etc.
 */
export function useCountdown(targetIso: string | null): CountdownResult {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!targetIso) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [targetIso]);

    if (!targetIso) {
        return { remainingMs: 0, isComplete: true, formatted: '00:00' };
    }

    const remainingMs = new Date(targetIso).getTime() - now;
    return {
        remainingMs: Math.max(0, remainingMs),
        isComplete: remainingMs <= 0,
        formatted: formatDuration(remainingMs),
    };
}
