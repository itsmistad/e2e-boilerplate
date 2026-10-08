import React from 'react';
import { useRouter } from 'expo-router';
import { Button, H4, Stack, Text, XStack } from 'tamagui';
import { useAuth } from '@modules/Auth/AuthProvider';

export const Header = () => {
    const router = useRouter();
    const { isAuthenticated, user, logout, isLoading } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const handleLogin = () => {
        router.push('/login');
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isLoading) {
        return (
            <XStack
                padding='$4'
                borderBottomWidth={1}
                borderBottomColor='$borderColor'
                backgroundColor='$background'
                justifyContent='space-between'
                alignItems='center'>
                <H4>Loading...</H4>
            </XStack>
        );
    }

    return (
        <XStack
            padding='$4'
            borderBottomWidth={1}
            borderBottomColor='$borderColor'
            backgroundColor='$background'
            justifyContent='space-between'
            alignItems='center'>
            <Stack>
                <H4>My App</H4>
                {isAuthenticated && user && (
                    <Text fontSize='$2' color='$gray10'>
                        {user.email}
                    </Text>
                )}
            </Stack>
            {isAuthenticated ? (
                <Button
                    size='$3'
                    theme='red'
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                    opacity={isLoggingOut ? 0.5 : 1}>
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
            ) : (
                <Button size='$3' theme='active' onPress={handleLogin}>
                    Login
                </Button>
            )}
        </XStack>
    );
};

