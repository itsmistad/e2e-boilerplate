import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import superjson from 'superjson';
import type { AppRouter } from '@apps/orchestrator';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { getAuthToken, loadAuthToken } from '@modules/Auth/tokenStorage';

export type TRPCInputs = inferRouterInputs<AppRouter>;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;

export const { TRPCProvider: TRPCContextProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
});

export const TRPCProvider = ({ children }: PropsWithChildren) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Load token from storage on mount
        loadAuthToken().then(() => {
            setIsReady(true);
        });
    }, []);

    const [trpcClient] = useState(() =>
        createTRPCClient<AppRouter>({
            links: [
                httpBatchLink({
                    url: 'http://localhost:3000',
                    transformer: superjson,
                    headers: () => {
                        const token = getAuthToken();
                        return token ? { Authorization: `Bearer ${token}` } : {};
                    },
                }),
            ],
        }),
    );

    if (!isReady) {
        return null; // Or a loading spinner
    }

    return (
        <QueryClientProvider client={queryClient}>
            <TRPCContextProvider trpcClient={trpcClient} queryClient={queryClient}>
                {children}
            </TRPCContextProvider>
        </QueryClientProvider>
    );
};
