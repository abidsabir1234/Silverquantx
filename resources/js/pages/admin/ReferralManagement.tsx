import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { referralService } from '@/services/referralService';
import { settingsService } from '@/services/settingsService';
import type { ReferralEntry } from '@/data/referralSeed';
import type { ReferralRules } from '@/data/referralRulesSeed';

export default function ReferralManagement() {
    const [referrals, setReferrals] = useState<ReferralEntry[] | null>(null);
    const [rules, setRules] = useState<ReferralRules | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deactivateTarget, setDeactivateTarget] = useState<ReferralEntry | null>(null);

    function refresh() {
        referralService.getAllReferrals().then(setReferrals);
    }

    useEffect(() => {
        refresh();
        settingsService.getReferralRules().then(setRules);
    }, []);

    async function handleSaveRules() {
        if (!rules) return;
        setIsSaving(true);
        try {
            const updated = await settingsService.updateReferralRules(rules);
            setRules(updated);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Referral Program Rules</CardTitle>
                </CardHeader>
                {!rules ? (
                    <LoadingState />
                ) : (
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="Bonus Hours per Referral"
                                type="number"
                                step="0.5"
                                value={rules.bonusHoursPerReferral}
                                onChange={(e) => setRules({ ...rules, bonusHoursPerReferral: Number(e.target.value) })}
                            />
                            <Input
                                label="Minimum Deposit for Eligibility ($)"
                                type="number"
                                value={rules.minDepositForEligibility}
                                onChange={(e) => setRules({ ...rules, minDepositForEligibility: Number(e.target.value) })}
                            />
                        </div>
                        <label className="flex items-center gap-2.5 text-sm text-text">
                            <input
                                type="checkbox"
                                checked={rules.programActive}
                                onChange={(e) => setRules({ ...rules, programActive: e.target.checked })}
                                className="size-4 rounded border-border accent-silver"
                            />
                            Referral program is active
                        </label>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveRules} isLoading={isSaving}>
                                Save Rules
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <Card padding="none">
                {!referrals ? (
                    <LoadingState />
                ) : referrals.length === 0 ? (
                    <EmptyState title="No referrals found" />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Referred User</TableHeadCell>
                                <TableHeadCell>Joined</TableHeadCell>
                                <TableHeadCell>Bonus Hours</TableHeadCell>
                                <TableHeadCell>Bonus Status</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {referrals.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">{r.userName}</TableCell>
                                    <TableCell className="text-text-muted">
                                        {new Date(r.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell>{r.bonusHours.toFixed(1)}</TableCell>
                                    <TableCell>
                                        <Badge variant={r.bonusStatus === 'claimed' ? 'completed' : 'pending'}>{r.bonusStatus}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={r.status === 'active' ? 'active' : 'inactive'}>{r.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown
                                            items={[
                                                r.status === 'active'
                                                    ? {
                                                          label: 'Deactivate',
                                                          destructive: true,
                                                          onClick: () => setDeactivateTarget(r),
                                                      }
                                                    : {
                                                          label: 'Activate',
                                                          onClick: () => referralService.setReferralStatus(r.id, 'active').then(refresh),
                                                      },
                                            ]}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            <ConfirmModal
                isOpen={deactivateTarget !== null}
                onClose={() => setDeactivateTarget(null)}
                onConfirm={async () => {
                    if (!deactivateTarget) return;
                    await referralService.setReferralStatus(deactivateTarget.id, 'inactive');
                    refresh();
                    setDeactivateTarget(null);
                }}
                title="Deactivate Referral"
                description={deactivateTarget ? `${deactivateTarget.userName}'s referral record will be marked inactive.` : undefined}
                confirmLabel="Deactivate"
                confirmVariant="danger"
            />
        </div>
    );
}
