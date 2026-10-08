import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button, Form, Input, Spinner, Stack, Text, YStack, H2 } from 'tamagui';
import { useAuth } from '@modules/Auth/AuthProvider';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await login(email, password);
            router.replace('/(tabs)');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <YStack flex={1} justifyContent='center' alignItems='center' padding='$4' backgroundColor='$background'>
            <Stack maxWidth={400} width='100%' gap='$4'>
                <H2 textAlign='center'>Login</H2>
                <Form onSubmit={handleSubmit} gap='$4'>
                    <YStack gap='$2'>
                        <Text>Email</Text>
                        <Input
                            placeholder='Enter your email'
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoComplete='email'
                            editable={!isLoading}
                        />
                    </YStack>
                    <YStack gap='$2'>
                        <Text>Password</Text>
                        <Input
                            placeholder='Enter your password'
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize='none'
                            autoComplete='password'
                            editable={!isLoading}
                        />
                    </YStack>
                    {error && (
                        <Text color='$red10' fontSize='$3'>
                            {error}
                        </Text>
                    )}
                    <Form.Trigger asChild>
                        <Button
                            theme='active'
                            size='$4'
                            disabled={isLoading}
                            icon={isLoading ? () => <Spinner size='small' /> : undefined}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form.Trigger>
                </Form>
            </Stack>
        </YStack>
    );
}

