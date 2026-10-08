import { TRPCError } from '@trpc/server';
import { createPocketBaseInstance } from '../../../lib/pocketbase/pocketbase';
import { createAuthenticatedProcedure } from '../../../middleware/accessControl';
import { router, procedure } from '../../../trpc';
import { refreshTokenSchema, authResponseSchema } from '../schemas/session';
import { mapPocketBaseUser } from '../utils';

export const sessionRouter = router({
    /**
     * Get current user session
     */
    me: createAuthenticatedProcedure(procedure).query(async (opts) => {
        const { auth } = opts.ctx;

        if (!auth.user) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Not authenticated',
            });
        }

        return auth.user;
    }),

    /**
     * Refresh authentication token
     */
    refresh: procedure.input(refreshTokenSchema).mutation(async (opts) => {
        const { refreshToken } = opts.input;

        try {
            const pbInstance = createPocketBaseInstance(refreshToken);
            const authData = await pbInstance.collection('users').authRefresh();
            if (!pbInstance.authStore.isValid) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid refresh token',
                });
            }

            return authResponseSchema.parse({
                token: pbInstance.authStore.token || '',
                record: mapPocketBaseUser(authData.record),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to refresh token';
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message,
            });
        }
    }),

    /**
     * Logout current session
     */
    logout: createAuthenticatedProcedure(procedure).mutation(async (opts) => {
        const { auth } = opts.ctx;

        if (auth.token) {
            try {
                const pbInstance = createPocketBaseInstance(auth.token);
                pbInstance.authStore.clear();
            } catch (error) {
                // Ignore errors on logout
                console.error('Logout error:', error);
            }
        }

        return { success: true, message: 'Logged out successfully' };
    }),
});
