import { useCallback, useEffect, useState } from 'react';
import { Bot, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCountdown } from '@/hooks/useCountdown';
import { botService } from '@/services/botService';
import type { BotPass } from '@/data/botPassSeed';

function formatRemainingPass(expiresAt: string): string {
    const ms = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const totalHours = ms / (1000 * 60 * 60);
    const days = Math.floor(totalHours / 24);
    const hours = Math.floor(totalHours % 24);
    return `${days} Day${days === 1 ? '' : 's'} ${hours} Hour${hours === 1 ? '' : 's'}`;
}

export function BotCycleCard() {
    const [pass, setPass] = useState<BotPass | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [claimedAmount, setClaimedAmount] = useState<number | null>(null);

    const refresh = useCallback(() => {
        botService.getBotPass().then(setPass);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (pass?.cycle.status !== 'running') return;
        const interval = setInterval(refresh, 1000);
        return () => clearInterval(interval);
    }, [pass?.cycle.status, refresh]);

    const { remainingMs } = useCountdown(pass?.cycle.status === 'running' ? pass.cycle.endsAt : null);

    async function handleStart() {
        setError(null);
        setIsActionLoading(true);
        try {
            setClaimedAmount(null);
            setPass(await botService.startCycle());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsActionLoading(false);
        }
    }

    async function handleClaim() {
        setError(null);
        setIsActionLoading(true);
        try {
            const { pass: updated, amountClaimed } = await botService.claimCycle();
            setPass(updated);
            setClaimedAmount(amountClaimed);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsActionLoading(false);
        }
    }

    if (!pass) {
        return <Card padding="lg" className="h-56 animate-pulse" />;
    }

    const progressPercent =
        pass.cycle.status === 'running' ? Math.round(100 - (remainingMs / (pass.cycleDurationMinutes * 60_000)) * 100) : 0;

    const hhmmss =
        pass.cycle.status === 'running'
            ? new Date(remainingMs).toISOString().substring(11, 19)
            : '00:00:00';

    return (
        <Card padding="lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bot className="size-4 text-silver" />
                    <h3 className="text-lg font-semibold text-text">Bot Pass</h3>
                </div>
                <Badge variant={pass.status === 'active' ? 'active' : pass.status === 'expired' ? 'expired' : 'inactive'}>
                    {pass.status}
                </Badge>
            </div>

            {pass.status !== 'active' ? (
                <p className="mt-4 text-sm text-text-muted">
                    {pass.status === 'expired' ? 'Your Bot Pass has expired.' : 'Bot Pass is not currently active.'}
                </p>
            ) : (
                <>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-text-subtle">Remaining Pass</p>
                            <p className="font-medium text-text">{formatRemainingPass(pass.passExpiresAt)}</p>
                        </div>
                        <div>
                            <p className="text-text-subtle">Current Cycle</p>
                            <p className="font-medium capitalize text-text">{pass.cycle.status.replace('_', ' ')}</p>
                        </div>
                    </div>

                    {pass.cycle.status === 'running' && (
                        <div className="mt-4">
                            <div className="mb-1.5 flex items-center justify-between text-xs text-text-subtle">
                                <span>Progress: {progressPercent}%</span>
                                <span>Remaining: {hhmmss}</span>
                            </div>
                            <ProgressBar value={progressPercent} />
                        </div>
                    )}

                    <div className="mt-6 flex flex-col items-center gap-3 rounded-control border border-border-subtle bg-surface-alt py-6">
                        {pass.cycle.status === 'idle' && (
                            <Button leftIcon={<Play className="size-4" />} isLoading={isActionLoading} onClick={handleStart}>
                                Start Bot
                            </Button>
                        )}
                        {pass.cycle.status === 'running' && (
                            <p className="text-sm text-text-muted">Bot is running this cycle.</p>
                        )}
                        {pass.cycle.status === 'claim_available' && (
                            <Button leftIcon={<Sparkles className="size-4" />} isLoading={isActionLoading} onClick={handleClaim}>
                                Claim 3 Hours
                            </Button>
                        )}
                        {pass.cycle.status === 'claimed' && (
                            <>
                                <div className="flex items-center gap-2 text-success">
                                    <CheckCircle2 className="size-5" />
                                    <span className="text-sm font-medium">
                                        Claimed{claimedAmount !== null ? ` — $${claimedAmount.toFixed(2)}` : ''}
                                    </span>
                                </div>
                                <Button leftIcon={<Play className="size-4" />} isLoading={isActionLoading} onClick={handleStart}>
                                    Next Cycle
                                </Button>
                            </>
                        )}
                    </div>
                </>
            )}

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </Card>
    );
}
