import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';

export function CtaBanner() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-card border border-accent/20 px-8 py-16 text-center shadow-[0_0_0_1px_rgba(124,140,248,0.12)] shadow-elevated sm:px-14">
                <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover opacity-[0.14]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface/95 to-bg-alt" aria-hidden />
                <div
                    className="pointer-events-none absolute left-1/2 top-[-220px] size-[480px] -translate-x-1/2 rounded-full bg-accent opacity-25 blur-[60px]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute bottom-[-180px] right-[-60px] size-[340px] rounded-full bg-glow-steel opacity-[0.18] blur-[60px]"
                    aria-hidden
                />

                <h2 className="relative text-3xl font-extrabold tracking-tight text-text sm:text-[35px]">
                    Ready to start earning?
                </h2>
                <p className="relative mx-auto mt-3.5 max-w-md text-[15.5px] text-text-muted">
                    Join in minutes, fund your first package, and watch your dashboard update in real time.
                </p>
                <Link
                    to="/register"
                    className={buttonVariants({ size: 'lg', className: 'relative isolate mt-7 overflow-hidden' })}
                >
                    <span
                        className="animate-btn-sheen pointer-events-none absolute inset-y-0 left-[-60%] w-2/5 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                        aria-hidden
                    />
                    Get Started
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </section>
    );
}
