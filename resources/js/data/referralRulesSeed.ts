export interface ReferralRules {
    bonusHoursPerReferral: number;
    minDepositForEligibility: number;
    programActive: boolean;
}

export const referralRulesSeed: ReferralRules = {
    bonusHoursPerReferral: 1.0,
    minDepositForEligibility: 20,
    programActive: true,
};
