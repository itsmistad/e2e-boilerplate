import type { UserRole } from '../routers/users/schemas/role';
import type { User } from '../routers/users/schemas/user';
import { createPocketBaseInstance } from '../lib/pocketbase/pocketbase';

/**
 * Authentication context that will be attached to tRPC context
 */
export interface AuthContext {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
}

/**
 * Extract authentication token from request headers
 */
export function extractAuthToken(headers: Record<string, string | string[] | undefined>): string | null {
    const authHeader = headers.authorization || headers.Authorization;

    if (typeof authHeader === 'string') {
        // Support both "Bearer <token>" and just "<token>"
        if (authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return authHeader;
    }

    return null;
}

/**
 * Verify and get user from PocketBase token
 */
export async function verifyAuthToken(token: string): Promise<User | null> {
    try {
        const pbInstance = createPocketBaseInstance(token);

        // Verify the token by trying to get the current user
        const authData = pbInstance.authStore.model;

        if (!authData) {
            return null;
        }

        // Refresh the auth to ensure token is valid
        await pbInstance.collection('users').authRefresh();

        // Get user record
        const userRecord = pbInstance.authStore.model;

        if (!userRecord) {
            return null;
        }

        // Map PocketBase user to our AuthUser type
        return {
            id: userRecord.id,
            email: userRecord.email || '',
            name: userRecord.name,
            emailVisibility: userRecord.emailVisibility,
            verified: userRecord.verified,
            role: (userRecord.role as UserRole) || 'user',
            mfaEnabled: userRecord.mfaEnabled,
            created: userRecord.created,
            updated: userRecord.updated,
        } as User;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

/**
 * Create authentication context from request
 */
export async function createAuthContext(headers: Record<string, string | string[] | undefined>): Promise<AuthContext> {
    const token = extractAuthToken(headers);

    if (!token) {
        return {
            user: null,
            isAuthenticated: false,
            token: null,
        };
    }

    const user = await verifyAuthToken(token);

    return {
        user,
        isAuthenticated: !!user,
        token: user ? token : null,
    };
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, requiredRoles: UserRole[]): boolean {
    if (!user) {
        return false;
    }

    return requiredRoles.includes(user.role);
}

/**
 * Check if user has at least one of the required roles
 */
export function hasAnyRole(user: User | null, requiredRoles: UserRole[]): boolean {
    return hasRole(user, requiredRoles);
}

/**
 * Check if user has all required roles (for future multi-role support)
 */
export function hasAllRoles(user: User | null, requiredRoles: UserRole[]): boolean {
    if (!user || requiredRoles.length === 0) {
        return false;
    }

    // For now, users have a single role, so this is equivalent to hasRole
    // In the future, if users can have multiple roles, this would check all
    return requiredRoles.includes(user.role);
}
