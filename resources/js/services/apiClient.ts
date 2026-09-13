const BASE_URL = '/api';

export class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(message: string, status: number, errors?: Record<string, string[]>) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

function getToken(): string | null {
    try {
        const raw = localStorage.getItem('sqx_session');
        if (!raw) return null;
        return (JSON.parse(raw) as { token?: string }).token ?? null;
    } catch {
        return null;
    }
}

function firstValidationError(errors?: Record<string, string[]>): string | undefined {
    if (!errors) return undefined;
    const first = Object.values(errors)[0];
    return first?.[0];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers as Record<string, string> | undefined),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (response.status === 204) {
        return undefined as T;
    }

    let data: unknown = null;
    try {
        data = await response.json();
    } catch {
        // No JSON body (e.g. network error page) — data stays null.
    }

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('sqx_session');
            localStorage.removeItem('sqx_user');
        }
        const body = (data ?? {}) as { message?: string; errors?: Record<string, string[]> };
        const message = body.message || firstValidationError(body.errors) || 'Something went wrong. Please try again.';
        throw new ApiError(message, response.status, body.errors);
    }

    return data as T;
}

function toBody(body: unknown): BodyInit | undefined {
    if (body === undefined) return undefined;
    return body instanceof FormData ? body : JSON.stringify(body);
}

export const apiClient = {
    get: <T>(path: string): Promise<T> => request<T>(path, { method: 'GET' }),
    post: <T>(path: string, body?: unknown): Promise<T> => request<T>(path, { method: 'POST', body: toBody(body) }),
    put: <T>(path: string, body?: unknown): Promise<T> => request<T>(path, { method: 'PUT', body: toBody(body) }),
};

/** Appends `?user_id=` for the admin "view another account" pattern shared across services. */
export function withUserId(path: string, userId?: string): string {
    return userId ? `${path}${path.includes('?') ? '&' : '?'}user_id=${encodeURIComponent(userId)}` : path;
}
