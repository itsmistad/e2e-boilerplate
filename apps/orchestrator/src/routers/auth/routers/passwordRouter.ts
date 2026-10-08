import { TRPCError } from '@trpc/server';
import { pb, createPocketBaseInstance } from '../../../lib/pocketbase/pocketbase';
import { createAuthenticatedProcedure } from '../../../middleware/accessControl';
import { router, procedure } from '../../../trpc';
import {
    passwordLoginSchema,
    passwordRegisterSchema,
    changePasswordSchema,
    resetPasswordRequestSchema,
    resetPasswordSchema,
} from '../schemas/password';
import { authResponseSchema } from '../schemas/session';
import { mapPocketBaseUser } from '../utils';

export const passwordRouter = router({
    /**
     * Register a new user with email and password
     */
    register: procedure.input(passwordRegisterSchema).mutation(async (opts) => {
        const { email, password, passwordConfirm, username, role } = opts.input;

        if (password !== passwordConfirm) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Passwords do not match',
            });
        }

        try {
            await pb.collection('users').create({
                email,
                password,
                passwordConfirm,
                username,
                role: role || 'user',
                emailVisibility: true,
            });

            // Automatically authenticate after registration
            const authData = await pb.collection('users').authWithPassword(email as string, password as string);

            return authResponseSchema.parse({
                token: authData.token || '',
                record: mapPocketBaseUser(authData.record),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message,
            });
        }
    }),

    /**
     * Login with email and password
     */
    login: procedure.input(passwordLoginSchema).mutation(async (opts) => {
        const { email, password } = opts.input;

        try {
            const authData = await pb.collection('users').authWithPassword(email as string, password as string);

            return authResponseSchema.parse({
                token: authData.token || '',
                record: mapPocketBaseUser(authData.record),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid email or password';
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message,
            });
        }
    }),

    /**
     * Change password (requires authentication)
     */
    changePassword: createAuthenticatedProcedure(procedure)
        .input(changePasswordSchema)
        .mutation(async (opts) => {
            const { oldPassword, newPassword, newPasswordConfirm } = opts.input;
            const { auth } = opts.ctx;

            if (newPassword !== newPasswordConfirm) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'New passwords do not match',
                });
            }

            if (!auth.token) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                });
            }

            try {
                const pbInstance = createPocketBaseInstance(auth.token);
                await pbInstance.collection('users').update(auth.user!.id, {
                    oldPassword,
                    password: newPassword,
                    passwordConfirm: newPasswordConfirm,
                });

                return { success: true };
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to change password';
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message,
                });
            }
        }),

    /**
     * Request password reset
     */
    requestReset: procedure.input(resetPasswordRequestSchema).mutation(async (opts) => {
        const { email } = opts.input;

        try {
            await pb.collection('users').requestPasswordReset(email);
            return { success: true, message: 'Password reset email sent' };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to send password reset email';
            // Don't reveal if email exists or not for security
            return { success: true, message };
        }
    }),

    /**
     * Reset password with token
     */
    reset: procedure.input(resetPasswordSchema).mutation(async (opts) => {
        const { token, password, passwordConfirm } = opts.input;

        if (password !== passwordConfirm) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Passwords do not match',
            });
        }

        try {
            await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
            return { success: true, message: 'Password reset successful' };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid or expired reset token';
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message,
            });
        }
    }),
});
