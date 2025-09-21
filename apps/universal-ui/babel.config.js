module.exports = function (api) {
    api.cache(true);

    const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID != null;

    return {
        presets: ['babel-preset-expo', '@babel/preset-typescript'],
        sourceMaps: isTest,
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
                    config: './src/modules/Tamagui/tamagui.ts',
                    logTimings: true,
                    disable: isTest,
                    disableExtraction: process.env.NODE_ENV === 'development',
                },
            ],

            // NOTE: this is only necessary if you are using reanimated for animations
            'react-native-worklets/plugin',
        ],
    };
};
