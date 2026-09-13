import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3">
            <span className="text-xs text-text-subtle">
                Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<ChevronLeft className="size-4" />}
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Prev
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<ChevronRight className="size-4" />}
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
