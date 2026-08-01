'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import type { User, UserRole } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
}

export const DEMO_ACCOUNTS: Record<UserRole, { label: string; email: string; password: string }> = {
    tenant: { label: 'Demo Tenant', email: 'aarif@gmail.com', password: 'password123' },
    landlord: { label: 'Demo Landlord', email: 'rahim@rentnest.com', password: 'password123' },
    admin: { label: 'Demo Admin', email: 'admin@rentnest.com', password: 'admin123' },
};

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    activeRole: UserRole;
    setActiveRole: (role: UserRole) => void;
    login: (data: LoginPayload) => Promise<User>;
    register: (data: RegisterPayload) => Promise<User>;
    loginDemo: (role: UserRole) => Promise<User>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeRole, setActiveRoleState] = useState<UserRole>('tenant');

    const persistRole = (role: UserRole) => {
        setActiveRoleState(role);
        try {
            localStorage.setItem('rentnest_active_role', role);
        } catch {
            // storage unavailable
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const data = unwrap<{ user?: User } | User>(await api.get('/auth/me'));
            const u = (data as { user?: User }).user || (data as User);
            setUser(u);
            const savedRole = (typeof window !== 'undefined' && localStorage.getItem('rentnest_active_role')) as UserRole | null;
            persistRole(savedRole || u.role || 'tenant');
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (data: LoginPayload) => {
        try {
            const payload = unwrap<{ user: User }>(await api.post('/auth/login', data));
            const u = payload.user;
            setUser(u);
            persistRole(u.role);
            await queryClient.clear();
            return u;
        } catch (error) {
            throw new Error(getErrorMessage(error, 'Unable to sign in.'));
        }
    };

    const register = async (data: RegisterPayload) => {
        try {
            const payload = unwrap<{ user: User }>(await api.post('/auth/register', data));
            const u = payload.user;
            setUser(u);
            persistRole(u.role);
            await queryClient.clear();
            return u;
        } catch (error) {
            throw new Error(getErrorMessage(error, 'Unable to create your account.'));
        }
    };

    const loginDemo = async (role: UserRole) => {
        const account = DEMO_ACCOUNTS[role];
        return login({ email: account.email, password: account.password });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // session already invalid
        } finally {
            setUser(null);
            try {
                localStorage.removeItem('rentnest_active_role');
            } catch {
                // ignore
            }
            queryClient.clear();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                activeRole,
                setActiveRole: persistRole,
                login,
                register,
                loginDemo,
                logout,
                refreshUser: fetchCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
