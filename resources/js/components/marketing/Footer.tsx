import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

const FOOTER_COLUMNS = [
    {
        heading: 'Platform',
        links: [
            { to: '/about', label: 'About' },
            { to: '/how-it-works', label: 'How It Works' },
            { to: '/packages', label: 'Packages' },
            { to: '/referral', label: 'Referral' },
        ],
    },
    {
        heading: 'Support',
        links: [
            { to: '/faq', label: 'FAQ' },
            { to: '/contact', label: 'Contact' },
        ],
    },
    {
        heading: 'Legal',
        links: [
            { to: '/terms', label: 'Terms' },
            { to: '/privacy', label: 'Privacy' },
            { to: '/risk-disclosure', label: 'Risk Disclosure' },
        ],
    },
];

export function Footer() {
    return (
        <footer className="relative border-t border-border-subtle bg-bg-alt before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-accent/35 before:to-transparent before:content-['']">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
                    <div>
                        <Link to="/" className="flex items-center">
                            <Logo size="md" />
                        </Link>
                        <p className="mt-3.5 max-w-xs text-sm leading-relaxed text-text-muted">
                            A modern platform for managing packages, earning cycles, rewards and referrals from one
                            simple dashboard.
                        </p>
                    </div>

                    {FOOTER_COLUMNS.map((column) => (
                        <div key={column.heading}>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-text-subtle">{column.heading}</h5>
                            <nav className="mt-3.5 flex flex-col gap-2.5">
                                {column.links.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="text-sm text-text-muted transition-colors hover:text-text"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border-subtle pt-6 text-xs text-text-subtle sm:flex-row">
                    <span>&copy; {new Date().getFullYear()} SilverQuantX. All rights reserved.</span>
                    <span>Not a promise of guaranteed income.</span>
                </div>
            </div>
        </footer>
    );
}
