import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { buttonVariants } from '@/components/ui/Button';
import { faqItems } from '@/data/faq';

export function FaqSection({ limit, showViewAll = false }: { limit?: number; showViewAll?: boolean }) {
    const items = limit ? faqItems.slice(0, limit) : faqItems;

    return (
        <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-text">Frequently Asked Questions</h2>
                <p className="mt-3 text-text-muted">Straight answers about packages, deposits, and payouts — no fine print surprises.</p>
            </div>

            <div className="mt-10">
                <Accordion items={items} />
            </div>

            {showViewAll && (
                <div className="mt-8 flex justify-center">
                    <Link to="/faq" className={buttonVariants({ variant: 'outline' })}>
                        View All FAQs
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            )}
        </section>
    );
}
