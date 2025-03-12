import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <View style={styles.container}>
                <Text>This screen doesn't exist.</Text>
                <Link href='/' style={styles.link}>
                    <Text>Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
