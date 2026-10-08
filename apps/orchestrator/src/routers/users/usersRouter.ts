import { TRPCError } from '@trpc/server';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import type { CreateAuth, UsersRecord } from '@lib/pocketbase/types';
import { pb } from '@lib/pocketbase';
import {
    createAuthenticatedProcedure,
    createAdminProcedure,
    createUserProcedure,
} from '../../middleware/accessControl';
import { router, procedure } from '../../trpc';
import { createUserParamsSchema } from './schemas/user';

export const usersRouter = router({
    /**
     * List all users (admin only)
     */
    list: createAdminProcedure(procedure).query(() => {
        return pb.collection('users').getList(1, 100);
    }),

    /**
     * Get user by ID (authenticated users can view their own profile, admins can view any)
     */
    byId: createAuthenticatedProcedure(procedure)
        .input(z.string())
        .query(async (opts) => {
            const { input: id } = opts;
            const { user } = opts.ctx;

            // Users can only view their own profile unless they're admin
            if (user?.role !== 'admin' && user?.id !== id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You can only view your own profile',
                });
            }

            const foundUser = await pb.collection('users').getOne(id);
            if (!foundUser) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found',
                });
            }

            return foundUser;
        }),

    /**
     * Create a new user (admin only)
     */
    create: createAdminProcedure(procedure)
        .input(createUserParamsSchema)
        .mutation(async (opts) => {
            const {
                input: { name, email, role, password, passwordConfirm },
            } = opts;

            const user: CreateAuth<UsersRecord> = {
                email: email,
                name: name,
                role: role,
                emailVisibility: true,
                verified: false,
                mfaEnabled: false,
                password: password,
                passwordConfirm: passwordConfirm,
                tokenKey: uuid(),
            };

            await pb.collection('users').create(user);
            return user;
        }),

    /**
     * Get current user profile (authenticated users)
     */
    me: createUserProcedure(procedure).query((opts) => {
        const { user } = opts.ctx;

        if (!user) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Not authenticated',
            });
        }

        // Return user from auth context (from PocketBase)
        return user;
    }),
});
