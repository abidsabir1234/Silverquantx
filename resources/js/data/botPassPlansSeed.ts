export interface BotPassPlan {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    cycleDurationMinutes: number;
    status: 'active' | 'inactive';
}

export const botPassPlansSeed: BotPassPlan[] = [
    { id: 'bot-starter', name: 'Bot Starter', price: 15, durationDays: 30, cycleDurationMinutes: 180, status: 'active' },
    { id: 'bot-plus', name: 'Bot Plus', price: 35, durationDays: 30, cycleDurationMinutes: 120, status: 'active' },
    { id: 'bot-pro', name: 'Bot Pro', price: 60, durationDays: 30, cycleDurationMinutes: 60, status: 'active' },
];
