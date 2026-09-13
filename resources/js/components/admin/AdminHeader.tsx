import { useLocation, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ADMIN_NAV_ITEMS } from '@/components/admin/adminNavConfig';
import { NotificationPanel } from '@/components/app/NotificationPanel';
import { useAuth } from '@/hooks/useAuth';

function usePageMeta(): { title: string; description?: string } {
    const { pathname } = useLocation();
    const match = [...ADMIN_NAV_ITEMS].sort((a, b) => b.to.length - a.to.length).find((item) => pathname.startsWith(item.to));
    return { title: match?.label ?? 'Dashboard', description: match?.description };
}

export function AdminHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { user } = useAuth();
    const { title, description } = usePageMeta();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border-subtle bg-bg/90 px-4 backdrop-blur-md sm:px-6">
            <button type="button" onClick={onOpenMenu} aria-label="Open menu" className="text-text-subtle hover:text-text lg:hidden">
                <Menu className="size-5" />
            </button>

            <div className="min-w-0">
                <h1 className="text-lg font-semibold leading-tight text-text">{title}</h1>
                {description && <p className="hidden truncate text-xs text-text-subtle sm:block">{description}</p>}
            </div>

            <div className="ml-auto flex items-center gap-4">
                <NotificationPanel />

                <Link to="/admin/settings" className="flex items-center gap-2.5">
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
