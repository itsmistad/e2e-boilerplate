import { createCallerFactory, router } from '../trpc';
import { authRouter } from './auth/routers/authRouter';
import { healthRouter } from './health/healthRouter';
import { usersRouter } from './users/usersRouter';

export const appRouter = router({
    health: healthRouter,
    user: usersRouter,
    auth: authRouter,
});
export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
