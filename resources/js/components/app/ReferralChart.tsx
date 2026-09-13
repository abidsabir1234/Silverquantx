import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import type { ReferralActivityPoint } from '@/data/referralSeed';

export function ReferralChart({ data }: { data: ReferralActivityPoint[] }) {
    return (
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2622" vertical={false} />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{ background: '#111715', border: '1px solid #1e2622', borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: '#f3f4f6' }}
                        cursor={{ fill: '#161e1b' }}
                    />
                    <Bar dataKey="referrals" fill="#00C985" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
