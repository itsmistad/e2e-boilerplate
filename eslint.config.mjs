import ESLint from '@eslint/js';
import Markdown from '@eslint/markdown';
import PrettierRecommended from 'eslint-plugin-prettier/recommended';
import Yml from 'eslint-plugin-yml';
import globals from 'globals';

export default [
    ...Markdown.configs.recommended,
    ...Markdown.configs.processor,
    ...Yml.configs['flat/standard'],
    {
        files: ['**/*.md'],
        rules: {
            'prettier/prettier': 'error',
        },
    },
    {
        files: ['**[!apps]/*.md/*.ts', '**[!apps]/*.md/*.tsx'],
        rules: {
            'eslint-comments/no-unused-disable': 'off',
        },
    },
    {
        files: ['**[!apps]/*.?(m)@(j|t)s?(x)'],
        rules: {
            ...ESLint.configs.recommended.rules,
            indent: 'off',
            quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
            'no-empty': 'off',
            'prefer-const': 'off',
            'no-use-before-define': 'off',
            'no-shadow': 'off',
            'no-var': 'error',
            'no-else-return': ['error', { allowElseIf: false }],
            'prettier/prettier': 'error',
            'jsx-quotes': ['error', 'prefer-single'],
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        ignores: [
            '**/node_modules',
            '**/.git',
            '**/.expo',
            '**/dist',
            '**/web-build',
            '**/expo-env.d.ts',
            '**/*.orig.*',
            '**/*.jks',
            '**/*.p8',
            '**/*.p12',
            '**/*.key',
            '**/*.mobileprovision',
            '**/.metro-health-check*',
            '**/npm-debug.*',
            '**/yarn-debug.*',
            '**/yarn-error.*',
            '**/.DS_Store',
            '**/*.pem',
            '**/.env*',
            '**/*.tsbuildinfo',
            '**/.turbo',
            '**/pnpm-lock.yaml',
        ],
    },
    PrettierRecommended,
];
