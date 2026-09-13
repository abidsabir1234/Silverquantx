import { useLocation, Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { APP_NAV_ITEMS } from '@/components/app/navConfig';
import { NotificationPanel } from '@/components/app/NotificationPanel';
import { useAuth } from '@/hooks/useAuth';

function usePageTitle(): string {
    const { pathname } = useLocation();
    const match = [...APP_NAV_ITEMS].sort((a, b) => b.to.length - a.to.length).find((item) => pathname.startsWith(item.to));
    return match?.label ?? 'Dashboard';
}

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { user } = useAuth();
    const title = usePageTitle();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border-subtle bg-bg/90 px-4 backdrop-blur-md sm:px-6">
            <button type="button" onClick={onOpenMenu} aria-label="Open menu" className="text-text-subtle hover:text-text lg:hidden">
                <Menu className="size-5" />
            </button>

            <h1 className="text-lg font-semibold text-text">{title}</h1>

            <div className="ml-auto flex items-center gap-4">
                <div className="hidden items-center gap-2 rounded-control border border-border bg-surface-alt px-3 py-2 text-sm text-text-subtle sm:flex">
                    <Search className="size-4" />
                    <input
                        type="search"
                        placeholder="Search"
                        className="w-40 bg-transparent text-text placeholder:text-text-subtle outline-none"
                    />
                </div>

                <NotificationPanel />

                <Link to="/app/profile" className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-surface-alt text-xs font-semibold text-text">
                        {user?.fullName
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')}
                    </span>
                    <span className="hidden text-sm font-medium text-text sm:inline">{user?.fullName}</span>
                </Link>
            </div>
        </header>
    );
}
