import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';
import { config } from '@modules/Tamagui/tamagui';
import { Something } from '../Something';

describe('Something', () => {
    it('renders the Something component', async () => {
        render(
            <TamaguiProvider config={config}>
                <Something />
            </TamaguiProvider>,
        );
        expect(await screen.findByText('Something')).toBeVisible();
    });
});
