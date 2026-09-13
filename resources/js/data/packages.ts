export type PackageStatus = 'active' | 'inactive';

export interface PackagePlan {
    id: string;
    name: string;
    amount: number;
    duration: number; // days
    hourlyRate: string;
    status: PackageStatus;
    featured?: boolean;
}

/** Configurable package data (§10) — never hardcode business logic against these values in UI. */
export const packages: PackagePlan[] = [
    { id: 'starter', name: 'Starter', amount: 1, duration: 5, hourlyRate: '$0.004/hr', status: 'active' },
    { id: 'basic', name: 'Basic', amount: 10, duration: 5, hourlyRate: '$0.04/hr', status: 'active' },
    { id: 'plus', name: 'Plus', amount: 50, duration: 5, hourlyRate: '$0.20/hr', status: 'active' },
    { id: 'growth', name: 'Growth', amount: 100, duration: 5, hourlyRate: '$0.42/hr', status: 'active', featured: true },
    { id: 'advanced', name: 'Advanced', amount: 500, duration: 7, hourlyRate: '$2.20/hr', status: 'active' },
    { id: 'professional', name: 'Professional', amount: 1000, duration: 7, hourlyRate: '$4.50/hr', status: 'active' },
    { id: 'elite', name: 'Elite', amount: 5000, duration: 10, hourlyRate: '$23.00/hr', status: 'active' },
    { id: 'premier', name: 'Premier', amount: 10000, duration: 10, hourlyRate: '$47.00/hr', status: 'active' },
];
