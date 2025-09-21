// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { withTamagui } = require('@tamagui/metro-plugin');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
    // [Web-only]: Enables CSS support in Metro.
    isCSSEnabled: true,
});

config.resolver = {
    ...config.resolver,
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
};

const tamaguiModule = './src/modules/Tamagui';

module.exports = withTamagui(config, {
    components: ['tamagui'],
    config: path.join(tamaguiModule, 'tamagui.ts'),
    outputCSS: path.join(tamaguiModule, 'web.css'),
});
