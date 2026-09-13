export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export const faqItems: FaqItem[] = [
    {
        id: 'how-does-it-work',
        question: 'How does the platform work?',
        answer:
            'You deposit funds, activate a package, and run earning cycles on your dashboard. Each cycle produces earnings based on your package\'s configured hourly rate, which you can claim once the cycle completes.',
    },
    {
        id: 'create-account',
        question: 'How do I create an account?',
        answer:
            'Click "Get Started", provide your name, email, mobile number and a password. If you were referred, your referral code is applied automatically.',
    },
    {
        id: 'deposits',
        question: 'How do deposits work?',
        answer:
            'Choose PKR (Easypaisa, JazzCash, Bank Transfer) or USD (Crypto, USDT), enter the amount, attach your payment proof, and submit. Deposits are reviewed before funds are credited to your wallet.',
    },
    {
        id: 'currency-conversion',
        question: 'How are currencies converted?',
        answer:
            'PKR deposits are converted to USD using the current platform exchange rate, which is set and updated by the admin team.',
    },
    {
        id: 'packages',
        question: 'What are packages?',
        answer:
            'Packages are earning plans with a fixed amount, duration and hourly rate. Activating a package starts your earning cycles for the length of its duration.',
    },
    {
        id: 'bonus-hours',
        question: 'What are bonus hours?',
        answer:
            'Bonus hours are rewards earned when people you refer join and become eligible, in accordance with the platform\'s referral rules.',
    },
    {
        id: 'referral-system',
        question: 'How does the referral system works?',
        answer:
            'Share your referral link or code. When a new user registers with it, you may become eligible for bonus hours once the platform\'s referral criteria are met.',
    },
    {
        id: 'package-expiry',
        question: 'What happens when a package expires?',
        answer:
            'Your package moves to an expired state — no further cycles can be started on it. All historical earnings and transactions remain visible for your records.',
    },
    {
        id: 'bot-pass',
        question: 'What is Bot Pass?',
        answer:
            'Bot Pass is an optional automated earning mode with its own duration and cycle length, separate from your manual package cycles.',
    },
    {
        id: 'withdrawals',
        question: 'How can I withdraw funds?',
        answer:
            'Go to Withdraw, choose a method, enter your account details and amount, and confirm. Processing time and any fees are shown before you submit.',
    },
];
