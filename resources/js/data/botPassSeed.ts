export type BotCycleStatus = 'idle' | 'running' | 'claim_available' | 'claimed';
export type BotPassStatus = 'active' | 'inactive' | 'expired';

export interface BotPass {
    status: BotPassStatus;
    /** Anchor timestamp for the "Remaining Pass" duration — set by the platform (§38), not the UI. */
    passExpiresAt: string;
    cycleDurationMinutes: number;
    cycle: {
        status: BotCycleStatus;
        startedAt: string | null;
        endsAt: string | null;
    };
}

/** A brand-new account has no Bot Pass until they purchase one. */
export const botPassSeed: BotPass = {
    status: 'inactive',
    passExpiresAt: new Date(0).toISOString(),
    cycleDurationMinutes: 180,
    cycle: {
        status: 'idle',
        startedAt: null,
        endsAt: null,
    },
};
