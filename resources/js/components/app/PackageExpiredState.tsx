import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { buttonVariants } from '@/components/ui/Button';
import type { CurrentPackage } from '@/data/currentPackage';
import type { EarningCycle } from '@/data/cycleSeed';

export function PackageExpiredState({ pkg, cycle }: { pkg: CurrentPackage; cycle: EarningCycle | null }) {
    return (
        <Card padding="lg">
            <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
                <div>
                    <h3 className="font-semibold text-text">Your package has expired.</h3>
                    <p className="mt-1 text-sm text-text-muted">
                        Unused bot time expires with the package per platform rules. Your historical earnings and
                        transactions remain available below for your records.
                    </p>
                </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                    <dt className="text-text-subtle">Package End Date</dt>
                    <dd className="mt-1 font-medium text-text">
                        {new Date(pkg.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </dd>
                </div>
                <div>
                    <dt className="text-text-subtle">Final Cycle Status</dt>
                    <dd className="mt-1 font-medium capitalize text-text">{cycle ? cycle.status.replace('_', ' ') : '—'}</dd>
                </div>
                <div>
                    <dt className="text-text-subtle">Expired Earnings</dt>
                    <dd className="mt-1 font-medium text-text">{pkg.hourlyRate}</dd>
                </div>
                <div>
                    <dt className="text-text-subtle">Bot Status</dt>
                    <dd className="mt-1 font-medium text-text">Expired with package</dd>
                </div>
            </dl>

            {/* Plain anchor (not React Router Link) so the browser natively jumps to the in-page section. */}
            <a href="#browse-packages" className={buttonVariants({ className: 'mt-6' })}>
                View Packages
            </a>
        </Card>
    );
}
