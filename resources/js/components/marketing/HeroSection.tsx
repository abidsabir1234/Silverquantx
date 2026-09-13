import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, Package, TrendingUp, Clock } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Grain texture — fixed so it reads as a whole-page finish, not just this section */}
            <div
                className="grain-overlay pointer-events-none fixed inset-0 z-40 opacity-[0.045] mix-blend-overlay"
                aria-hidden
            />

            {/* Decorative gradient mesh + grid, confined to the hero's height */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[780px] overflow-hidden" aria-hidden>
                <div className="animate-mesh-a absolute -left-28 -top-20 size-[520px] rounded-full bg-accent opacity-30 blur-[90px]" />
                <div className="animate-mesh-b absolute -right-36 top-10 size-[460px] rounded-full bg-glow-steel opacity-20 blur-[90px]" />
                <div className="animate-mesh-c absolute left-[40%] top-[260px] size-[420px] rounded-full bg-glow-slate opacity-[0.16] blur-[90px]" />
                <div
                    className="absolute inset-0 opacity-[0.35]"
                    style={{
                        backgroundImage:
                            'linear-gradient(var(--color-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px)',
                        backgroundSize: '56px 56px',
                        maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="relative animate-slide-up">
                        <div
                            className="pointer-events-none absolute -left-32 -top-16 -z-10 size-[440px] rounded-full bg-accent opacity-[0.22] blur-[70px]"
                            aria-hidden
                        />
                        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-text-muted">
                            <span className="animate-pulse-dot size-1.5 rounded-full bg-success shadow-[0_0_0_3px_rgba(34,197,94,0.18)]" />
                            Live platform &middot; cycles running now
                        </span>

                        <h1 className="mt-6 bg-gradient-to-b from-silver-light to-text bg-clip-text text-4xl font-extrabold leading-[1.04] tracking-[-0.028em] text-transparent sm:text-[58px]">
                            Manage Your Digital Earnings With Confidence
                        </h1>
                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-muted">
                            Activate a package, track every earning cycle in real time, and grow your referral
                            network — all from a single dashboard built for clarity, not guesswork.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                to="/register"
                                className={buttonVariants({ size: 'lg', className: 'relative isolate overflow-hidden' })}
                            >
                                <span
                                    className="animate-btn-sheen pointer-events-none absolute inset-y-0 left-[-60%] w-2/5 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                                    aria-hidden
                                />
                                Get Started
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link to="/packages" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                                Explore Packages
                            </Link>
                        </div>
                        <p className="mt-6 max-w-md text-xs leading-relaxed text-text-subtle">
                            Earnings depend on active packages and platform terms. Past activity is not a promise of
                            future results.
                        </p>
                    </div>

                    <div className="relative min-h-[460px] animate-slide-up [animation-delay:120ms]">
                        <div
                            className="pointer-events-none absolute inset-0 m-auto size-[380px] rounded-full bg-accent opacity-[0.28] blur-[30px]"
                            aria-hidden
                        />

                        <div className="animate-float-y relative mx-auto aspect-square w-[340px] max-w-full" aria-hidden>
                            <svg viewBox="0 0 400 400" className="size-full overflow-visible">
                                <defs>
                                    <radialGradient id="heroCoin" cx="35%" cy="30%" r="75%">
                                        <stop offset="0%" stopColor="#f3f4f6" />
                                        <stop offset="55%" stopColor="#c7cdd6" />
                                        <stop offset="100%" stopColor="#828a99" />
                                    </radialGradient>
                                    <linearGradient id="heroLine" x1="0" y1="1" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#00C985" stopOpacity="0" />
                                        <stop offset="55%" stopColor="#00C985" />
                                        <stop offset="100%" stopColor="#e5e7eb" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    cx="200"
                                    cy="200"
                                    r="178"
                                    fill="none"
                                    stroke="#00C985"
                                    strokeOpacity=".28"
                                    strokeWidth="1.5"
                                    strokeDasharray="2 11"
                                    className="animate-spin-slow origin-center"
                                />
                                <circle
                                    cx="200"
                                    cy="200"
                                    r="136"
                                    fill="none"
                                    stroke="#c7cdd6"
                                    strokeOpacity=".2"
                                    strokeWidth="1"
                                    strokeDasharray="1 7"
                                    className="animate-spin-slow-rev origin-center"
                                />
                                <g className="animate-spin-slow origin-center">
                                    <circle cx="336" cy="200" r="7" fill="#00C985" />
                                </g>
                                <g className="animate-spin-slow-rev origin-center">
                                    <circle cx="64" cy="200" r="5" fill="#e5e7eb" />
                                </g>
                                <path
                                    d="M46,318 C104,296 132,332 182,286 C232,240 260,266 322,182"
                                    fill="none"
                                    stroke="url(#heroLine)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <circle cx="200" cy="200" r="86" fill="url(#heroCoin)" stroke="#080B0A" strokeWidth="2" />
                                <circle cx="200" cy="200" r="86" fill="none" stroke="#00C985" strokeOpacity=".45" strokeWidth="1" />
                                <text
                                    x="200"
                                    y="217"
                                    textAnchor="middle"
                                    fontFamily="Plus Jakarta Sans, sans-serif"
                                    fontWeight="800"
                                    fontSize="62"
                                    fill="#080B0A"
                                >
                                    $
                                </text>
                            </svg>
                        </div>

                        {/* Illustrative dashboard preview — not live data, mirrors the real user dashboard from §17/§18 */}
                        <Card glass padding="lg" className="animate-float-y absolute bottom-0 right-0 w-[340px] max-w-full [animation-delay:1.2s]">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-text-muted">Wallet Balance</span>
                                <Wallet className="size-4 text-silver" />
                            </div>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-text">$1,250.50</p>

                            <div className="mt-6 rounded-control border border-border-subtle bg-surface-alt p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-medium text-text">
                                        <Package className="size-4 text-silver" />
                                        Growth Package
                                    </div>
                                    <Badge variant="active">Active</Badge>
                                </div>
                                <div className="mt-3 h-[7px] w-full overflow-hidden rounded-full bg-border-subtle">
                                    <div className="animate-progress-grow h-full w-2/3 rounded-full bg-gradient-to-r from-accent to-silver" />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-text-subtle">
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3.5" /> 4 Days remaining
                                    </span>
                                    <span className="flex items-center gap-1 text-success">
                                        <TrendingUp className="size-3.5" /> +$8.40 today
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                                    Recent Activity
                                </p>
                                {[
                                    { label: 'Earning cycle claimed', amount: '+$4.20' },
                                    { label: 'Referral bonus received', amount: '+1.0 hr' },
                                    { label: 'Deposit approved', amount: '+$500.00' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between text-sm">
                                        <span className="text-text-muted">{item.label}</span>
                                        <span className="font-medium text-text">{item.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
