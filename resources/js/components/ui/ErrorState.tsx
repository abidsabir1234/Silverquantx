import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ErrorState({
    message = 'Something went wrong. Please try again.',
    onRetry,
}: {
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <AlertCircle className="size-8 text-danger" />
            <p className="text-sm text-text-muted">{message}</p>
            {onRetry && (
                <Button variant="secondary" size="sm" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </div>
    );
}
