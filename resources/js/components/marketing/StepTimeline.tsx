import type { ReactNode } from 'react';

export interface TimelineStep {
    title: string;
    description: string;
    icon: ReactNode;
}

export function StepTimeline({ steps }: { steps: TimelineStep[] }) {
    return (
        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div
                className="absolute inset-x-[10%] top-7 hidden h-px overflow-hidden bg-gradient-to-r from-transparent via-border to-transparent lg:block"
                aria-hidden
            >
                <div className="animate-shimmer-x h-full bg-[linear-gradient(90deg,transparent,var(--color-accent)_45%,transparent_55%,transparent)]" />
            </div>

            {steps.map((step, index) => (
                <div
                    key={step.title}
                    className="animate-fade-in relative flex flex-col items-center text-center"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="relative z-10 flex size-14 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent/20 to-surface text-silver-light shadow-[0_0_0_6px_var(--color-bg),0_10px_22px_-12px_rgba(124,140,248,0.5)]">
                        {step.icon}
                    </div>
                    <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-subtle">
                        Step {index + 1}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-text">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-text-muted">{step.description}</p>
                </div>
            ))}
        </div>
    );
}
