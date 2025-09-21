#!/usr/bin/env ts-node

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';

const userSchema = z.object({
    id: z.string(),
    displayName: z.string(),
});
type User = z.infer<typeof userSchema>;

const createUserParamsSchema = userSchema.pick({ displayName: true });

const usersMap = new Map<string, User>();

const appRouter = router({
    health: publicProcedure.query(async () => {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }),
    userList: publicProcedure.query(async () => {
        return Array.from(usersMap.values());
    }),
    userById: publicProcedure.input(z.string()).query(async (opts) => {
        const { input: id } = opts;
        return userSchema.parse(usersMap.get(id));
    }),
    userCreate: publicProcedure.input(createUserParamsSchema).mutation(async (opts) => {
        const {
            input: { displayName },
        } = opts;

        const user: User = {
            id: uuid(),
            displayName,
        };

        return usersMap.set(user.id, user);
    }),
});

//  To avoid embedding the source of the router, we explicitly export the type declaration signature and NOT the router itself.
export type AppRouter = typeof appRouter;
export { appRouter };

const server = createHTTPServer({
    router: appRouter,
});

server.listen(3000);
