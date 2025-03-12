#!/usr/bin/env ts-node

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const appRouter = router({
    userList: publicProcedure.query(async () => {
        return [];
    }),
    userById: publicProcedure.input(z.string()).query(async () => {
        return null;
    }),
    userCreate: publicProcedure.input(z.object({ name: z.string() })).mutation(async (opts) => {
        const { input } = opts;
        return { ...input };
    }),
});

const server = createHTTPServer({
    router: appRouter,
});

server.listen(3000);
