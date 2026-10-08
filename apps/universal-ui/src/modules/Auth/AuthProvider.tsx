import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TRPCOutputs } from '@modules/API/TRPCProvider';
import { useTRPC } from '@modules/API/TRPCProvider';
import { clearAuthToken, getAuthTokenAsync, setAuthToken } from './tokenStorage';

type User = TRPCOutputs['auth']['session']['me'];

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setToken: (token: string) => Promise<void>;
    clearToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const trpc = useTRPC();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    const meQuery = useQuery({
        ...trpc.auth.session.me.queryOptions(),
        retry: false,
        enabled: hasToken, // Only fetch when we have a token
    });
    const loginMutation = useMutation(trpc.auth.password.login.mutationOptions());
    const logoutMutation = useMutation(trpc.auth.session.logout.mutationOptions());

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Update user when query data changes
    useEffect(() => {
        if (meQuery.data) {
            setUser(meQuery.data);
            setIsLoading(false);
        } else if (meQuery.isError) {
            setUser(null);
            setIsLoading(false);
            clearToken();
        }
    }, [meQuery.data, meQuery.isError]);

    const checkAuth = async () => {
        const token = await getAuthTokenAsync();
        if (token) {
            setHasToken(true);
            // Query will automatically run when hasToken becomes true
        } else {
            setIsLoading(false);
        }
    };

    const setToken = async (token: string) => {
        await setAuthToken(token);
        setHasToken(true);
        // Query will automatically run when hasToken becomes true
    };

    const clearToken = async () => {
        await clearAuthToken();
        setUser(null);
        setHasToken(false);
    };

    const login = async (email: string, password: string) => {
        const result = await loginMutation.mutateAsync({ email, password });
        await setToken(result.token);
    };

    const logout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch {
            // Ignore logout errors
        } finally {
            await clearToken();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading: isLoading || meQuery.isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                setToken,
                clearToken,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
