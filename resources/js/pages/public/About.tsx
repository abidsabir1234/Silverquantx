import { Shield, Layers, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const VALUES = [
    { title: 'Trust-first', description: 'Every balance, cycle and payout is designed to be transparent and auditable.', icon: Shield },
    { title: 'Built for clarity', description: 'Clean dashboards over noisy, overloaded interfaces — always know where you stand.', icon: Layers },
    { title: 'Community-driven', description: 'Referrals and rewards are structured to grow the platform together with its members.', icon: Users },
];

export default function About() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-text">About SilverQuantX</h1>
                <p className="mt-4 text-text-muted">
                    SilverQuantX is a package and earning-cycle management platform built with the polish and
                    discipline of a modern fintech product — clear balances, transparent cycles, and a referral
                    system with no misleading promises.
                </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-card border border-border-subtle">
                <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
                    alt="Team reviewing account and earnings data together"
                    loading="lazy"
                    className="h-64 w-full object-cover sm:h-80"
                />
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {VALUES.map((value) => (
                    <Card key={value.title}>
                        <value.icon className="size-5 text-silver" />
                        <h3 className="mt-3 text-sm font-semibold text-text">{value.title}</h3>
                        <p className="mt-1.5 text-sm text-text-muted">{value.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
