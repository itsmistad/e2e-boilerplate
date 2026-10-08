import { router, procedure } from '../../trpc';

export const healthRouter = router({
    check: procedure.query(async () => {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }),
});
