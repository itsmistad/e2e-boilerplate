import { useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import superjson from 'superjson';
import { TamaguiProvider } from 'tamagui';
import { trpc } from '@modules/API';
import { tamaguiConfig } from '@modules/Tamagui';
import SpaceMono from '../assets/fonts/SpaceMono-Regular.ttf';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: 'http://localhost:3000/trpc',
                    async headers() {
                        return {
                            // authorization: getAuthCookie(),
                        };
                    },
                    transformer: superjson,
                }),
            ],
        }),
    );
    const [loaded] = useFonts({
        SpaceMono,
        Inter: '@tamagui/font-inter/otf/Inter-Medium.otf',
        InterBold: '@tamagui/font-inter/otf/Inter-Bold.otf',
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Stack>
                            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                            <Stack.Screen name='+not-found' />
                        </Stack>
                        <StatusBar style='auto' />
                    </ThemeProvider>
                </TamaguiProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}
