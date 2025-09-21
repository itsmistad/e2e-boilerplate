import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@apps/orchestrator';

// Explicitly declaring `trpc`s type like-so prevents an issue with symlink'd node_module resolution (a known issue with pnpm + tsc).
export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();
