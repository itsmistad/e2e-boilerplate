module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['.'],
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
                    alias: {
                        '@modules': './src/modules',
                        '@assets': './assets/',
                    },
                },
            ],
            [
                '@tamagui/babel-plugin',
                {
                    components: ['tamagui'],
                    config: './modules/Tamagui/tamagui.config.ts',
                    logTimings: true,
                    disableExtraction: process.env.NODE_ENV === 'development',
                },
            ],

            // NOTE: this is only necessary if you are using reanimated for animations
            'react-native-reanimated/plugin',
        ],
    };
};
