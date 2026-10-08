import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { createAuthContext, type AuthContext } from './middleware/auth';

/**
 * Context type for tRPC
 */
export interface Context {
    auth: AuthContext;
}

/**
 * Create context for each request
 */
export async function createContext(opts: CreateHTTPContextOptions): Promise<Context> {
    const auth = await createAuthContext(opts.req.headers as Record<string, string | string[] | undefined>);

    return {
        auth,
    };
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const { router, procedure, mergeRouters, createCallerFactory } = t;
