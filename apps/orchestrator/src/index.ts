#!/usr/bin/env -S npx tsx

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { initializePocketBase } from './lib/pocketbase/pocketbase';
import { appRouter } from './routers/appRouter';
import { createContext } from './trpc';

// Initialize PocketBase
initializePocketBase().catch((error) => {
    console.error('Failed to initialize PocketBase:', error);
    process.exit(1);
});

const server = createHTTPServer({
    middleware: cors(),
    router: appRouter,
    createContext,
});

server.listen(3000);

//  To avoid embedding the source of the router, we explicitly export the type declaration signature and NOT the router itself.
export type { AppRouter } from './routers/appRouter';
