export interface BonusHoursSummary {
    available: number;
    pending: number;
    used: number;
    totalEarned: number;
}

/** A brand-new account starts with no bonus hours — every hour from here on is earned from a real referral. */
export const bonusHoursSeed: BonusHoursSummary = {
    available: 0,
    pending: 0,
    used: 0,
    totalEarned: 0,
};

export interface ReferralEntry {
    id: string;
    userName: string;
    joinedAt: string;
    status: 'active' | 'inactive';
    bonusHours: number;
    bonusStatus: 'pending' | 'claimed';
}

export interface ReferralActivityPoint {
    label: string;
    referrals: number;
}
