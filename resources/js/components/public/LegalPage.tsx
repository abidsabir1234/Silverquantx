export interface LegalSection {
    heading: string;
    body: string[];
}

export function LegalPage({ title, updatedAt, sections }: { title: string; updatedAt: string; sections: LegalSection[] }) {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-text">{title}</h1>
            <p className="mt-2 text-sm text-text-subtle">Last updated: {updatedAt}</p>

            <div className="mt-10 space-y-8">
                {sections.map((section) => (
                    <div key={section.heading}>
                        <h2 className="text-lg font-semibold text-text">{section.heading}</h2>
                        <div className="mt-2.5 space-y-3">
                            {section.body.map((paragraph, i) => (
                                <p key={i} className="text-sm leading-relaxed text-text-muted">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
