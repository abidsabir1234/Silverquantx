export interface PackageHistoryEntry {
    id: string;
    name: string;
    amount: number;
    hourlyRate: string;
    status: 'completed' | 'expired';
    startedAt: string;
    endedAt: string;
}
