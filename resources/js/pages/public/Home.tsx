import { HeroSection } from '@/components/marketing/HeroSection';
import { StatsSection } from '@/components/marketing/StatsSection';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { TrustSection } from '@/components/marketing/TrustSection';
import { PackagesSection } from '@/components/marketing/PackagesSection';
import { ReferralSection } from '@/components/marketing/ReferralSection';
import { FaqSection } from '@/components/marketing/FaqSection';
import { CtaBanner } from '@/components/marketing/CtaBanner';

export default function Home() {
    return (
        <>
            <HeroSection />
            <StatsSection />
            <HowItWorksSection />
            <TrustSection />
            <PackagesSection limit={4} showViewAll />
            <ReferralSection />
            <FaqSection limit={5} showViewAll />
            <CtaBanner />
        </>
    );
}
