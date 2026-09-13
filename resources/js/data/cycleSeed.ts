export type CycleStatus = 'ready' | 'running' | 'claim_available' | 'claimed';

export interface EarningCycle {
    status: CycleStatus;
    /** Anchor timestamps — the countdown UI derives remaining time from these, never from a local counter. */
    startedAt: string | null;
    endsAt: string | null;
    durationMinutes: number;
    lastClaimedAt: string | null;
}

export const cycleSeed: EarningCycle = {
    status: 'ready',
    startedAt: null,
    endsAt: null,
    durationMinutes: 60,
    lastClaimedAt: null,
};
