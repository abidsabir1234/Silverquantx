import { LegalPage } from '@/components/public/LegalPage';

export default function RiskDisclosure() {
    return (
        <LegalPage
            title="Risk Disclosure"
            updatedAt="August 1, 2026"
            sections={[
                {
                    heading: 'No Guaranteed Income',
                    body: [
                        'SilverQuantX packages, manual earning cycles, and Bot Pass cycles reflect scheduled platform participation, not a fixed-income investment product. Past cycle activity is not a promise of future results, and no fixed, minimum, or guaranteed return is offered on any deposit.',
                    ],
                },
                {
                    heading: 'Capital at Risk',
                    body: [
                        'Any amount you deposit or use to activate a package is at risk. You should never deposit funds you cannot afford to have tied up or, in an adverse scenario, lose entirely.',
                    ],
                },
                {
                    heading: 'Platform and Operational Risk',
                    body: [
                        'Earning cycles, Bot Pass availability, referral bonus eligibility, and withdrawal processing depend on the platform continuing to operate normally. Technical issues, policy changes, or extraordinary circumstances could delay or affect access to your balance.',
                    ],
                },
                {
                    heading: 'Referral Program Risk',
                    body: [
                        'Bonus hours earned through referrals depend on your referred users meeting the eligibility rules in effect at the time, which SilverQuantX may change prospectively.',
                    ],
                },
                {
                    heading: 'Your Responsibility',
                    body: [
                        'You are responsible for evaluating whether participation is appropriate for your circumstances, for keeping your account credentials secure, and for reviewing our Terms of Service before depositing funds.',
                    ],
                },
            ]}
        />
    );
}
