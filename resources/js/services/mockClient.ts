/**
 * Simulated network layer every mock service is built on. Standing in for real
 * `fetch()` calls to a future Laravel API — swap the body of this function later
 * and every service that calls it keeps working unchanged.
 */
export interface MockRequestOptions {
    /** Simulated round-trip latency in ms. */
    delayMs?: number;
    /** 0-1 chance the request rejects, to exercise error states. */
    errorRate?: number;
    errorMessage?: string;
}

export function mockRequest<T>(data: T, options: MockRequestOptions = {}): Promise<T> {
    const { delayMs = 350, errorRate = 0, errorMessage = 'Something went wrong. Please try again.' } = options;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (errorRate > 0 && Math.random() < errorRate) {
                reject(new Error(errorMessage));
                return;
            }
            resolve(data);
        }, delayMs);
    });
}
