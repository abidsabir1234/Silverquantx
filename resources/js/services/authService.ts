import { apiClient } from '@/services/apiClient';
import type { MockUser, UserRole } from '@/data/users';

export interface Session {
    userId: string;
    token: string;
    expiresAt: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
    referralCode?: string;
}

const SESSION_KEY = 'sqx_session';
const USER_KEY = 'sqx_user';

/** The backend never returns a password hash — filled in so the response still satisfies MockUser's shape. */
function toMockUser(user: Omit<MockUser, 'passwordHash'>): MockUser {
    return { ...user, passwordHash: '' };
}

function persist(session: Session, user: MockUser): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clear(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
}

export const authService = {
    login(identifier: string, password: string, requiredRole?: UserRole): Promise<{ session: Session; user: MockUser }> {
        return apiClient
            .post<{ session: Session; user: Omit<MockUser, 'passwordHash'> }>('/auth/login', { identifier, password, role: requiredRole })
            .then(({ session, user }) => {
                const mockUser = toMockUser(user);
                persist(session, mockUser);
                return { session, user: mockUser };
            });
    },

    register(payload: RegisterPayload): Promise<{ session: Session; user: MockUser }> {
        return apiClient
            .post<{ session: Session; user: Omit<MockUser, 'passwordHash'> }>('/auth/register', payload)
            .then(({ session, user }) => {
                const mockUser = toMockUser(user);
                persist(session, mockUser);
                return { session, user: mockUser };
            });
    },

    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            clear();
        }
    },

    /** Re-validates the session against the server — call on app load to catch an expired/revoked token. */
    async me(): Promise<MockUser | null> {
        if (!authService.getSession()) return null;
        try {
            const { user } = await apiClient.get<{ user: Omit<MockUser, 'passwordHash'> }>('/auth/me');
            const mockUser = toMockUser(user);
            localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
            return mockUser;
        } catch {
            clear();
            return null;
        }
    },

    getSession(): Session | null {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            if (!raw) return null;
            const session = JSON.parse(raw) as Session;
            if (new Date(session.expiresAt).getTime() < Date.now()) {
                clear();
                return null;
            }
            return session;
        } catch {
            return null;
        }
    },

    /** Synchronous cached read (from the last login/register/me), used for optimistic UI on first render. */
    getCurrentUser(): MockUser | null {
        if (!authService.getSession()) return null;
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? (JSON.parse(raw) as MockUser) : null;
        } catch {
            return null;
        }
    },
};
