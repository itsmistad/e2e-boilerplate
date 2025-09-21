import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';
import './web.css';

export const config = createTamagui(defaultConfig);

type Conf = typeof config;

declare module 'tamagui' {
    interface TamaguiCustomConfig extends Conf {}
}
