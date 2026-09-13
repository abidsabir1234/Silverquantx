export interface ExchangeRate {
    rate: number; // 1 USD = `rate` PKR
    previousRate: number;
    updatedBy: string;
    updatedAt: string;
}

export const exchangeRateSeed: ExchangeRate = {
    rate: 280,
    previousRate: 278,
    updatedBy: 'Platform Admin',
    updatedAt: '2026-08-20T09:00:00.000Z',
};
