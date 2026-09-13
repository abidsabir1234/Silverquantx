import type { ReactNode } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';

export interface ChartCardProps {
    title: string;
    isLoading?: boolean;
    children: ReactNode;
}

export function ChartCard({ title, isLoading, children }: ChartCardProps) {
    return (
        <Card padding="lg">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            {isLoading ? <LoadingState /> : <div className="h-56 w-full">{children}</div>}
        </Card>
    );
}
