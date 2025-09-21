const ES_MODULE_PATTERNS = [
    'react-native',
    '@react-native',
    'react-native-worklets/plugin',
    '@gorhom/bottom-sheet/mock',
    'expo',
    '@expo',
    '@react-navigation',
    'superjson',
];

/** @type {import('jest').Config} */
const config = {
    rootDir: '.',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    clearMocks: true,
    preset: 'jest-expo',
    setupFiles: ['<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js'],
    globals: {
        __DEV__: true,
    },
    transformIgnorePatterns: [`node_modules/.pnpm/(?!${ES_MODULE_PATTERNS.join('|')})`],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    },
};

export default config;
