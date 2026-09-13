type ClassValue = string | number | bigint | null | boolean | undefined | ClassValue[];

function flatten(value: ClassValue, out: string[]): void {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
        for (const item of value) flatten(item, out);
        return;
    }
    out.push(String(value));
}

/** Joins conditional class names into a single string, dropping falsy values. */
export function cn(...values: ClassValue[]): string {
    const out: string[] = [];
    for (const value of values) flatten(value, out);
    return out.join(' ');
}
