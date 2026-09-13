import { ShieldCheck, LineChart, Headset } from 'lucide-react';

const PILLARS = [
    {
        title: 'Bank-grade security',
        description: 'Funds and account data are protected with encrypted infrastructure and strict access controls, monitored around the clock.',
        icon: ShieldCheck,
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
        alt: 'Secured data center server racks',
    },
    {
        title: 'Transparent reporting',
        description: 'Every balance, cycle and payout is logged and auditable — no hidden fees, no unexplained adjustments.',
        icon: LineChart,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        alt: 'Analytics dashboard displayed on a laptop screen',
    },
    {
        title: 'Real human support',
        description: 'A dedicated support team is on hand for account, deposit and withdrawal questions — not just an automated ticket queue.',
        icon: Headset,
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
        alt: 'Support team collaborating at a desk',
    },
];

export function TrustSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-text">Why members trust SilverQuantX</h2>
                <p className="mt-3 text-text-muted">
                    Built on the same operational discipline you'd expect from a modern financial product.
                </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {PILLARS.map((pillar) => (
                    <div
                        key={pillar.title}
                        className="group overflow-hidden rounded-card border border-border-subtle bg-surface shadow-card"
                    >
                        <div className="relative h-40 overflow-hidden">
                            <img
                                src={pillar.image}
                                alt={pillar.alt}
                                loading="lazy"
                                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                            <span className="absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-control border border-border-subtle bg-bg/80 text-accent backdrop-blur-sm">
                                <pillar.icon className="size-[18px]" />
                            </span>
                        </div>
                        <div className="p-5">
                            <h3 className="text-sm font-semibold text-text">{pillar.title}</h3>
                            <p className="mt-1.5 text-sm text-text-muted">{pillar.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
