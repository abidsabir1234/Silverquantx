import { Link } from 'react-router-dom';
import { Share2, UserPlus, Gift, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { buttonVariants } from '@/components/ui/Button';

const STEPS = [
    { title: 'Share your referral link', description: 'Every account gets a unique referral link and code.', icon: <Share2 className="size-6" /> },
    { title: 'A new user registers', description: 'They sign up using your link or referral code.', icon: <UserPlus className="size-6" /> },
    { title: 'Receive eligible bonus hours', description: 'Earn bonus hours once the referral meets platform criteria.', icon: <Gift className="size-6" /> },
];

export function ReferralSection() {
    return (
        <section id="referral" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-text">Refer &amp; Earn Bonus Hours</h2>
                    <p className="mt-3 text-text-muted">
                        Your network is worth more here. Share your link, and every active referral adds bonus
                        hours straight to your account.
                    </p>

                    <div className="mt-8 space-y-6">
                        {STEPS.map((step, index) => (
                            <div
                                key={step.title}
                                className="animate-fade-in flex items-start gap-4"
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent/20 to-surface text-silver-light shadow-[0_8px_18px_-10px_rgba(124,140,248,0.5)]">
                                    {step.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
                                        Step {index + 1}
                                    </p>
                                    <h3 className="text-sm font-semibold text-text">{step.title}</h3>
                                    <p className="text-sm text-text-muted">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-6 text-xs text-text-subtle">
                        Bonus hours are awarded per platform referral rules — the platform makes no promise of
                        guaranteed income from referrals.
                    </p>

                    <Link to="/register" className={buttonVariants({ className: 'mt-6' })}>
                        Get Your Referral Link
                        <ArrowRight className="size-4" />
                    </Link>
                </div>

                <div>
                    <svg viewBox="0 0 360 260" className="mx-auto w-full max-w-sm" aria-hidden>
                        <defs>
                            <linearGradient id="refLine" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#00C985" stopOpacity=".75" />
                                <stop offset="100%" stopColor="#00C985" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <g stroke="url(#refLine)" strokeWidth="1.6" strokeDasharray="4 7" fill="none">
                            <line x1="180" y1="130" x2="60" y2="45" className="animate-dash-flow" />
                            <line x1="180" y1="130" x2="305" y2="40" className="animate-dash-flow [animation-delay:.4s]" />
                            <line x1="180" y1="130" x2="45" y2="200" className="animate-dash-flow [animation-delay:.8s]" />
                            <line x1="180" y1="130" x2="308" y2="207" className="animate-dash-flow [animation-delay:1.2s]" />
                            <line x1="180" y1="130" x2="180" y2="245" className="animate-dash-flow [animation-delay:1.6s]" />
                        </g>
                        <g fill="#161e1b" stroke="#1e2622" strokeWidth="1.5">
                            <circle cx="60" cy="45" r="14" className="animate-pulse-dot" />
                            <circle cx="305" cy="40" r="14" className="animate-pulse-dot [animation-delay:.4s]" />
                            <circle cx="45" cy="200" r="14" className="animate-pulse-dot [animation-delay:.8s]" />
                            <circle cx="308" cy="207" r="14" className="animate-pulse-dot [animation-delay:1.2s]" />
                            <circle cx="180" cy="245" r="14" className="animate-pulse-dot [animation-delay:1.6s]" />
                        </g>
                        <circle cx="180" cy="130" r="27" fill="#111715" stroke="#00C985" strokeWidth="2" />
                        <text x="180" y="135" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="700" fill="#f3f4f6">
                            YOU
                        </text>
                    </svg>

                    <Card glass padding="lg" className="mt-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                            Your referral link appears here after you sign up
                        </p>
                        <div className="mt-2 truncate rounded-control border border-dashed border-border bg-surface-alt px-3.5 py-3 text-sm text-text-subtle">
                            silverquantx.com/register?ref=YOURCODE
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <StatCard label="Total Referrals" value="0" />
                            <StatCard label="Bonus Hours" value="0.0" />
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
