/** Shared status vocabulary used across badges, transactions, deposits, withdrawals, etc. */
export type Status =
    | 'active'
    | 'inactive'
    | 'pending'
    | 'processing'
    | 'completed'
    | 'rejected'
    | 'expired'
    | 'suspended';

export type AsyncState<T> =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'success'; data: T };
