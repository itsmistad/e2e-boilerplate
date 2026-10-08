import { TRPCError } from '@trpc/server';
import type { procedure } from '../trpc';
import { UsersRoleOptions } from '@lib/pocketbase/types';
import { hasAnyRole, type AuthContext } from './auth';

type Procedure = typeof procedure;

/**
 * Access control options
 */
export interface AccessControlOptions {
    /**
     * Required roles to access this endpoint
     * If empty, any authenticated user can access
     */
    roles?: UsersRoleOptions[];

    /**
     * If true, user must have ALL specified roles (for future multi-role support)
     * If false, user must have ANY of the specified roles
     */
    requireAll?: boolean;

    /**
     * Custom authorization function
     * Return true to allow access, false to deny
     */
    customCheck?: (authContext: AuthContext) => boolean | Promise<boolean>;
}

/**
 * Create an authenticated procedure that requires authentication
 */
export function createAuthenticatedProcedure<T extends Procedure>(
    baseProcedure: T,
    options: AccessControlOptions = {},
) {
    return baseProcedure.use(async (opts) => {
        const { ctx } = opts;

        // Get auth context from tRPC context
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const authContext = (ctx as any).auth as AuthContext | undefined;

        if (!authContext || !authContext.isAuthenticated || !authContext.user) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
            });
        }

        // Check custom authorization function
        if (options.customCheck) {
            const allowed = await options.customCheck(authContext);
            if (!allowed) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Access denied',
                });
            }
        }

        // Check role-based access control
        if (options.roles && options.roles.length > 0) {
            const hasAccess = options.requireAll
                ? hasAnyRole(authContext.user, options.roles) // For now, same as hasAnyRole
                : hasAnyRole(authContext.user, options.roles);

            if (!hasAccess) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: `Access denied. Required role: ${options.roles.join(' or ')}`,
                });
            }
        }

        return opts.next({
            ctx: {
                ...opts.ctx,
                auth: authContext,
                user: authContext.user,
            },
        });
    });
}

/**
 * Create a procedure that requires specific role(s)
 */
export function createRoleProtectedProcedure<T extends Procedure>(
    baseProcedure: T,
    roles: UsersRoleOptions[],
    options: Omit<AccessControlOptions, 'roles'> = {},
) {
    return createAuthenticatedProcedure(baseProcedure, {
        ...options,
        roles,
    });
}

/**
 * Create a procedure that requires admin role
 */
export function createAdminProcedure<T extends Procedure>(
    baseProcedure: T,
    options: Omit<AccessControlOptions, 'roles'> = {},
) {
    return createRoleProtectedProcedure(baseProcedure, [UsersRoleOptions.admin], options);
}

/**
 * Create a procedure that requires user role (or higher)
 */
export function createUserProcedure<T extends Procedure>(
    baseProcedure: T,
    options: Omit<AccessControlOptions, 'roles'> = {},
) {
    return createRoleProtectedProcedure(baseProcedure, [UsersRoleOptions.user, UsersRoleOptions.admin], options);
}
