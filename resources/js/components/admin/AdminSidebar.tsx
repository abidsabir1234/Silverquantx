import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { ADMIN_NAV_GROUPS } from '@/components/admin/adminNavConfig';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { Logo } from '@/components/ui/Logo';

function Brand() {
    return (
        <span className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="relative flex items-center">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-accent opacity-75 right-[-6px] top-[-3px]" />
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/20">
                    Admin
                </span>
            </span>
        </span>
    );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <nav className="flex-1 space-y-4 overflow-y-auto px-4 py-6 scrollbar-thin">
            {ADMIN_NAV_GROUPS.map((group) => (
                <div key={group.groupTitle} className="space-y-1.5">
                    <h6 className="px-3 text-[10px] font-bold uppercase tracking-widest text-text-subtle/50">
                        {group.groupTitle}
                    </h6>
                    <div className="space-y-1">
                        {group.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={onNavigate}
                                className={({ isActive }) =>
                                    cn(
                                        'relative flex items-center gap-3 rounded-control px-3.5 py-2 text-sm font-medium transition-all duration-200 ease-in-out',
                                        isActive
                                            ? 'bg-surface/80 text-text shadow-sm border border-border-subtle after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-5 after:w-[3px] after:rounded-r-full after:bg-accent'
                                            : 'text-text-muted hover:bg-surface/30 hover:text-text hover:pl-5'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={cn(
                                                'size-[18px] shrink-0 transition-transform duration-200',
                                                isActive ? 'text-accent scale-105' : 'text-text-subtle group-hover:text-text-muted'
                                            )}
                                        />
                                        <span>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
}

export function AdminSidebar() {
    const { logout } = useAuth();

    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border-subtle bg-gradient-to-b from-bg-alt to-[#080B0A] lg:flex">
            <div className="flex h-16 items-center border-b border-border-subtle px-5">
                <Brand />
            </div>
            <NavList />
            <div className="border-t border-border-subtle p-3 bg-bg-alt/30">
                <button
                    type="button"
                    onClick={() => logout()}
                    className="group flex w-full items-center gap-3 rounded-control px-3.5 py-2.5 text-sm font-medium text-text-muted transition-all duration-200 hover:bg-surface/50 hover:text-text"
                >
                    <LogOut className="size-[18px] text-text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-text" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export function MobileAdminSidebarDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { logout } = useAuth();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} aria-hidden />
            <div className="relative flex h-full w-72 max-w-[80vw] flex-col bg-gradient-to-b from-bg-alt to-[#080B0A] border-r border-border-subtle animate-slide-right">
                <div className="flex h-16 items-center justify-between border-b border-border-subtle px-5">
                    <Brand />
                    <button type="button" onClick={onClose} aria-label="Close menu" className="text-text-subtle hover:text-text">
                        <X className="size-5" />
                    </button>
                </div>
                <NavList onNavigate={onClose} />
                <div className="border-t border-border-subtle p-3 bg-bg-alt/30">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            logout();
                        }}
                        className="group flex w-full items-center gap-3 rounded-control px-3.5 py-2.5 text-sm font-medium text-text-muted transition-all duration-200 hover:bg-surface hover:text-text"
                    >
                        <LogOut className="size-[18px] text-text-subtle transition-transform duration-200 group-hover:translate-x-0.5" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
