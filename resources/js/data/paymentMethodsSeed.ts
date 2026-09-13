export interface PaymentMethodConfig {
    id: string;
    name: string;
    type: 'deposit' | 'withdrawal' | 'both';
    feePercent: number;
    status: 'active' | 'inactive';
}

export const paymentMethodsSeed: PaymentMethodConfig[] = [
    { id: 'easypaisa', name: 'Easypaisa', type: 'both', feePercent: 1.5, status: 'active' },
    { id: 'jazzcash', name: 'JazzCash', type: 'both', feePercent: 1.5, status: 'active' },
    { id: 'bank-transfer', name: 'Bank Transfer', type: 'both', feePercent: 1, status: 'active' },
    { id: 'crypto', name: 'Crypto', type: 'both', feePercent: 0.5, status: 'active' },
    { id: 'usdt', name: 'USDT', type: 'both', feePercent: 0.5, status: 'active' },
];
