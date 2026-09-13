export function ComingSoon({ title }: { title: string }) {
    return (
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-text">{title}</h1>
            <p className="mt-3 text-text-muted">This section is being built next.</p>
        </div>
    );
}
