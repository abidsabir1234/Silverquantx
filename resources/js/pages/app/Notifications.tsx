import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { cn } from '@/utils/cn';
import { notificationService } from '@/services/notificationService';
import type { NotificationItem } from '@/data/notificationsSeed';

export default function Notifications() {
    const [notifications, setNotifications] = useState<NotificationItem[] | null>(null);

    function refresh() {
        notificationService.list().then(setNotifications);
    }

    useEffect(refresh, []);

    const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={unreadCount === 0}
                    onClick={() => notificationService.markAllAsRead().then(refresh)}
                >
                    Mark All as Read
                </Button>
            </div>

            <Card padding="none">
                {!notifications ? (
                    <LoadingState />
                ) : notifications.length === 0 ? (
                    <EmptyState title="No notifications" description="You're all caught up." />
                ) : (
                    <div>
                        {notifications.map((n) => (
                            <button
                                key={n.id}
                                onClick={() => notificationService.markAsRead(n.id).then(refresh)}
                                className={cn(
                                    'flex w-full items-start gap-3 border-b border-border-subtle px-5 py-4 text-left last:border-b-0 hover:bg-surface-alt/40',
                                    !n.read && 'bg-surface-alt/40'
                                )}
                            >
                                {!n.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-text">{n.title}</p>
                                    <p className="text-sm text-text-muted">{n.message}</p>
                                    <p className="mt-1 text-xs text-text-subtle">
                                        {new Date(n.createdAt).toLocaleString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
