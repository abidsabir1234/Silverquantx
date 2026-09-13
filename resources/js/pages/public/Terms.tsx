import { LegalPage } from '@/components/public/LegalPage';

export default function Terms() {
    return (
        <LegalPage
            title="Terms of Service"
            updatedAt="August 1, 2026"
            sections={[
                {
                    heading: '1. Acceptance of Terms',
                    body: [
                        'By creating an account or otherwise accessing SilverQuantX, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use the platform.',
                    ],
                },
                {
                    heading: '2. Account Eligibility',
                    body: [
                        'You must be at least 18 years old and capable of forming a binding contract to register for an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.',
                    ],
                },
                {
                    heading: '3. Packages and Earning Cycles',
                    body: [
                        'Packages activate a time-bound earning cycle schedule at the hourly rate displayed at the time of purchase. Earning cycles and Bot Pass cycles are activity-based and reflect platform participation — they are not interest, dividends, or a guaranteed return on any deposit.',
                        'Rates, durations, and package availability may be adjusted by SilverQuantX at any time for future purchases; changes do not apply retroactively to an already-active package unless required by law.',
                    ],
                },
                {
                    heading: '4. Deposits and Withdrawals',
                    body: [
                        'Deposits are credited to your available balance only after manual or automated verification. Withdrawal requests are processed according to the processing times shown for each method and are subject to review before funds are released.',
                    ],
                },
                {
                    heading: '5. Referral Program',
                    body: [
                        'Referral bonus hours are awarded per the referral rules published on the platform at the time a referred user qualifies. SilverQuantX reserves the right to adjust referral rules prospectively and to withhold bonus hours obtained through fraudulent or abusive referral activity.',
                    ],
                },
                {
                    heading: '6. Prohibited Conduct',
                    body: [
                        'You may not use the platform for money laundering, to create duplicate or fraudulent accounts, to exploit software defects, or to otherwise circumvent these terms. SilverQuantX may suspend or terminate accounts found in violation.',
                    ],
                },
                {
                    heading: '7. No Guarantee of Returns',
                    body: [
                        'Nothing on this platform constitutes a guarantee, promise, or assurance of profit or income. Participation carries risk, and you should review our Risk Disclosure before depositing funds.',
                    ],
                },
                {
                    heading: '8. Changes to These Terms',
                    body: [
                        'We may update these Terms from time to time. Continued use of the platform after changes take effect constitutes acceptance of the revised Terms.',
                    ],
                },
            ]}
        />
    );
}
