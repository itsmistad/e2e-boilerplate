/** @type {import('prettier').Config} */
export default {
    bracketSpacing: true,
    jsxSingleQuote: true,
    jsxBracketSameLine: true,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
    useTabs: false,
    printWidth: 120,
    tabWidth: 4,
    overrides: [
        {
            files: ['**/*.y?(a)ml'],
            options: {
                tabWidth: 2,
                singleQuote: false,
            },
        },
        {
            files: '*.json',
            options: {
                singleQuote: false,
            },
        },
    ],
};
