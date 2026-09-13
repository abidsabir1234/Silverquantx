import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { RegisterPayload } from '@/services/authService';
import type { MockUser, UserRole } from '@/data/users';

export interface AuthContextValue {
    user: MockUser | null;
    isAuthenticated: boolean;
    login: (identifier: string, password: string, requiredRole?: UserRole) => Promise<MockUser>;
    register: (payload: RegisterPayload) => Promise<MockUser>;
    logout: () => Promise<void>;
    updateUser: (user: MockUser) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MockUser | null>(() => authService.getCurrentUser());

    // Cached user (above) renders instantly; re-validate against the server in the
    // background so an expired/revoked token doesn't leave a stale session in place.
    useEffect(() => {
        authService.me().then(setUser);
    }, []);

    const login = useCallback(async (identifier: string, password: string, requiredRole?: UserRole) => {
        const { user: loggedInUser } = await authService.login(identifier, password, requiredRole);
        setUser(loggedInUser);
        return loggedInUser;
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        const { user: newUser } = await authService.register(payload);
        setUser(newUser);
        return newUser;
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ user, isAuthenticated: user !== null, login, register, logout, updateUser: setUser }),
        [user, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
