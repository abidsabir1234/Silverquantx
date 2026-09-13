export interface CurrentPackage {
    id: string;
    name: string;
    amount: number;
    hourlyRate: string;
    status: 'active' | 'expired';
    startedAt: string;
    expiresAt: string;
}
