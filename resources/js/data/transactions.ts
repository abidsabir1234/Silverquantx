export type TransactionType = 'deposit' | 'withdrawal' | 'earning' | 'referral' | 'bonus' | 'package';
export type TransactionStatus = 'completed' | 'pending' | 'processing' | 'rejected';

export interface Transaction {
    id: string;
    userId: string;
    date: string; // ISO
    type: TransactionType;
    description: string;
    amount: number; // signed — negative for outflows
    currency: 'USD';
    balanceAfter: number;
    status: TransactionStatus;
    reference: string;
}

/** New accounts start with an empty ledger — every entry from here on is a real, user-initiated action. */
export const transactionsSeed: Transaction[] = [];
