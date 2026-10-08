import { useColorScheme } from 'react-native';
import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';
import { TRPCProvider } from '@modules/API/TRPCProvider';
import { AuthProvider } from '@modules/Auth/AuthProvider';
import { config as tamaguiConfig } from '../../tamagui.config';
import SpaceMono from '../assets/fonts/SpaceMono-Regular.ttf';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

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
        <TRPCProvider>
            <AuthProvider>
                <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Stack>
                            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                            <Stack.Screen name='login' options={{ headerShown: false }} />
                            <Stack.Screen name='+not-found' />
                        </Stack>
                        <StatusBar style='auto' />
                    </ThemeProvider>
                </TamaguiProvider>
            </AuthProvider>
        </TRPCProvider>
    );
}
