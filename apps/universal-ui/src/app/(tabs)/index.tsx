import { Text } from 'react-native';
import React from 'react';
import { trpc } from '@modules/API/trpc';

export default function HomeScreen() {
    const { data: userList } = trpc.userList.useQuery();

    return (
        <>
            <Text>Hello world!</Text>
            <Text>{JSON.stringify(userList, null, 4)}</Text>
        </>
    );
}
