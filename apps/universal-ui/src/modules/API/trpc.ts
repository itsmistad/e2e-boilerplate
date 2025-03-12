import { AppRouter } from '@repo/orchestrator';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
