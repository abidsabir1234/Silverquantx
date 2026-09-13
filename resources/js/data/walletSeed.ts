export interface WalletSummary {
    availableBalance: number;
    pendingBalance: number;
    totalEarnings: number;
    totalDeposits: number;
    totalWithdrawals: number;
}

/** A brand-new account starts at zero — balances only grow from real deposits and earnings. */
export const walletSeed: WalletSummary = {
    availableBalance: 0,
    pendingBalance: 0,
    totalEarnings: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
};
