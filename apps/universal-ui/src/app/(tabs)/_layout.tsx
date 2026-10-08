import { Platform } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Header } from '@modules/UI/Header';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                header: () => <Header />,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                }}
            />
        </Tabs>
    );
}
