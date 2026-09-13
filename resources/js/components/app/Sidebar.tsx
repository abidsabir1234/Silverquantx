import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { APP_NAV_ITEMS } from '@/components/app/navConfig';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { Logo } from '@/components/ui/Logo';

function Brand() {
    return <Logo size="sm" />;
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {APP_NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors',
                            isActive ? 'bg-surface-alt text-text' : 'text-text-muted hover:bg-surface hover:text-text'
                        )
                    }
                >
                    <item.icon className="size-[18px] shrink-0" />
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}

export function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border-subtle bg-bg-alt lg:flex">
            <div className="flex h-16 items-center border-b border-border-subtle px-5">
                <Brand />
            </div>
            <NavList />
            <div className="border-t border-border-subtle p-3">
                <button
                    type="button"
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
                >
                    <LogOut className="size-[18px]" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export function MobileSidebarDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { logout } = useAuth();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
            <div className="relative flex h-full w-72 max-w-[80vw] flex-col bg-bg-alt">
                <div className="flex h-16 items-center justify-between border-b border-border-subtle px-5">
                    <Brand />
                    <button type="button" onClick={onClose} aria-label="Close menu" className="text-text-subtle hover:text-text">
                        <X className="size-5" />
                    </button>
                </div>
                <NavList onNavigate={onClose} />
                <div className="border-t border-border-subtle p-3">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            logout();
                        }}
                        className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
                    >
                        <LogOut className="size-[18px]" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
