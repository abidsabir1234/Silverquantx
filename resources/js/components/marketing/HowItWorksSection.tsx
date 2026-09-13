import { UserPlus, Wallet, PackageCheck, PlayCircle, Gift } from 'lucide-react';
import { StepTimeline } from '@/components/marketing/StepTimeline';

const STEPS = [
    { title: 'Create Account', description: 'Sign up in minutes with your email and mobile number.', icon: <UserPlus className="size-6" /> },
    { title: 'Deposit Funds', description: 'Fund your wallet via your preferred local or crypto method.', icon: <Wallet className="size-6" /> },
    { title: 'Choose Package', description: 'Pick a package that matches your goals and duration.', icon: <PackageCheck className="size-6" /> },
    { title: 'Start Earning Cycle', description: 'Start your cycle and track progress in real time.', icon: <PlayCircle className="size-6" /> },
    { title: 'Claim Earnings', description: 'Claim your earnings and rewards once a cycle completes.', icon: <Gift className="size-6" /> },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-text">How It Works</h2>
                <p className="mt-3 text-text-muted">
                    From account creation to your first payout — here's exactly what to expect, no surprises.
                </p>
            </div>

            <div className="mt-12">
                <StepTimeline steps={STEPS} />
            </div>
        </section>
    );
}
