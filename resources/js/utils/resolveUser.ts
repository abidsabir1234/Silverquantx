/**
 * Synchronous lookup for admin tables that render a userId per row (transactions,
 * deposits, withdrawals). The backend embeds `userName`/`userEmail` on each row of
 * those admin list endpoints — the owning service primes this cache with them via
 * `primeUserCache()` before resolving its promise, so this stays synchronous.
 */
const cache = new Map<string, { name: string; email: string }>();

export function primeUserCache(entries: { id: string; name: string; email: string }[]): void {
    for (const entry of entries) {
        cache.set(entry.id, { name: entry.name, email: entry.email });
    }
}

export function resolveUser(userId: string): { name: string; email: string } {
    return cache.get(userId) ?? { name: 'Unknown user', email: '—' };
}
