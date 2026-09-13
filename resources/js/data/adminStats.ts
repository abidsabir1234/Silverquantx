export interface AdminSummary {
    totalUsers: number;
    activeUsers: number;
    totalDeposits: number;
    totalWithdrawals: number;
    activePackages: number;
    totalEarnings: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    /** Total package sales minus total earnings paid out — the platform's net position. */
    netPlatformRevenue: number;
}

export interface ChartPoint {
    label: string;
    value: number;
}
