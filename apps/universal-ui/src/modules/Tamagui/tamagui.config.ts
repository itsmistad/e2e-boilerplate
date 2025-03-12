import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

export const tamaguiConfig = createTamagui(defaultConfig);

type Conf = typeof tamaguiConfig;

// make imports typed
declare module 'tamagui' {
    interface TamaguiCustomConfig extends Conf {}
}
