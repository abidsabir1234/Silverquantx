import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/utils/cn';
import { notificationService } from '@/services/notificationService';
import type { NotificationItem } from '@/data/notificationsSeed';

function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[] | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) notificationService.list().then(setNotifications);
    }, [isOpen]);

    useEffect(() => {
        function onClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="relative text-text-subtle hover:text-text"
                aria-label="Notifications"
            >
                <Bell className="size-5" />
                {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-danger" />}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-card border border-border-subtle bg-surface shadow-elevated">
                    <div className="border-b border-border-subtle px-4 py-3">
                        <p className="text-sm font-semibold text-text">Notifications</p>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {!notifications ? (
                            <LoadingState />
                        ) : notifications.length === 0 ? (
                            <EmptyState title="No notifications" />
                        ) : (
                            notifications.slice(0, 6).map((n) => (
                                <div key={n.id} className={cn('border-b border-border-subtle px-4 py-3 last:border-b-0', !n.read && 'bg-surface-alt/40')}>
                                    <div className="flex items-start gap-2">
                                        {!n.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />}
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-text">{n.title}</p>
                                            <p className="truncate text-xs text-text-muted">{n.message}</p>
                                            <p className="mt-0.5 text-xs text-text-subtle">{timeAgo(n.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <Link
                        to="/app/notifications"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-center text-sm font-medium text-text-muted hover:text-text"
                    >
                        View All
                    </Link>
                </div>
            )}
        </div>
    );
}
