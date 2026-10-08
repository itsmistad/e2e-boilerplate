import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';
import { config as tamaguiConfig } from '../../../../tamagui.config';
import { Something } from '../Something';

describe('Something', () => {
    it('renders the Something component', async () => {
        render(
            <TamaguiProvider config={tamaguiConfig}>
                <Something />
            </TamaguiProvider>,
        );
        expect(await screen.findByText('Something')).toBeVisible();
    });
});
