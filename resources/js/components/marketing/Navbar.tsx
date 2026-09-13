import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
    { to: '/', label: 'Home', end: true },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/packages', label: 'Packages' },
    { to: '/referral', label: 'Referral' },
    { to: '/faq', label: 'FAQ' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-40 border-b transition-colors duration-200 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-gradient-to-r after:from-transparent after:via-accent/45 after:to-transparent after:content-[""]',
                isScrolled ? 'border-border-subtle bg-bg/85 backdrop-blur-md' : 'border-transparent bg-transparent'
            )}
        >
            <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center">
                    <Logo size="md" />
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                cn(
                                    'text-sm font-medium transition-colors',
                                    isActive ? 'text-text' : 'text-text-muted hover:text-text'
                                )
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <Link to="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                        Login
                    </Link>
                    <Link to="/register" className={buttonVariants({ size: 'sm' })}>
                        Get Started
                    </Link>
                </div>

                <button
                    type="button"
                    className="text-text md:hidden"
                    aria-label="Toggle menu"
                    onClick={() => setIsMobileOpen((v) => !v)}
                >
                    {isMobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {isMobileOpen && (
                <div className="border-t border-border-subtle bg-bg px-4 pb-6 pt-2 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={() => setIsMobileOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        'rounded-control px-3 py-2.5 text-sm font-medium transition-colors',
                                        isActive ? 'bg-surface text-text' : 'text-text-muted hover:text-text'
                                    )
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="mt-4 flex flex-col gap-2">
                        <Link
                            to="/login"
                            onClick={() => setIsMobileOpen(false)}
                            className={buttonVariants({ variant: 'secondary', fullWidth: true })}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsMobileOpen(false)}
                            className={buttonVariants({ fullWidth: true })}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
