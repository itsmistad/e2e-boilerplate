import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Form, H2, Input, Spinner, Stack, Text } from 'tamagui';
import { useTRPC } from '@modules/API/TRPCProvider';

export default function HomeScreen() {
    const trpc = useTRPC();
    const createUserMutation = useMutation(trpc.user.create.mutationOptions());
    const userListQuery = useQuery(trpc.user.list.queryOptions());
    const displayNameInputRef = useRef<Input>(null);
    const [displayName, setDisplayName] = useState<string | undefined>(undefined);

    const onSubmit = () => {
        if (!displayName) return;
        createUserMutation.mutate(
            {
                displayName,
            },
            {
                onSuccess: () => {
                    displayNameInputRef.current?.clear();
                    userListQuery.refetch();
                },
            },
        );
    };

    return (
        <Stack flex={1} justify='center' items='center'>
            <Stack maxHeight={800} flexDirection='row' gap='$2'>
                <Card borderRadius='$4' borderWidth={1} borderColor='$borderColor' padding='$8' gap='$2'>
                    <H2>Registered Users</H2>
                    <Text overflowY='auto'>{JSON.stringify(userListQuery.data, null, 4)}</Text>
                </Card>
                <Form
                    justify='center'
                    items='center'
                    gap='$2'
                    onSubmit={onSubmit}
                    borderRadius='$4'
                    borderWidth={1}
                    borderColor='$borderColor'
                    width={300}
                    padding='$8'>
                    <Input placeholder='Display Name' ref={displayNameInputRef} onChangeText={setDisplayName} />
                    <Form.Trigger asChild disabled={createUserMutation.isPending}>
                        <Button icon={createUserMutation.isPending ? () => <Spinner size='small' /> : undefined}>
                            Create User
                        </Button>
                    </Form.Trigger>
                </Form>
            </Stack>
        </Stack>
    );
}
