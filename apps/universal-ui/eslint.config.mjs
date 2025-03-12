import { fixupPluginRules } from '@eslint/compat';
import EslintComments from 'eslint-plugin-eslint-comments';
import Import from 'eslint-plugin-import';
import React from 'eslint-plugin-react';
import ReactNative from 'eslint-plugin-react-native';
import TSESLint from 'typescript-eslint';
import BaseConfig from '../../eslint.config.mjs';

/** @type {import('typescript-eslint').Config} */
export default TSESLint.config(
    BaseConfig,
    {
        plugins: {
            'eslint-comments': fixupPluginRules(EslintComments),
            'react-native': fixupPluginRules(ReactNative),
        },
    },
    React.configs.flat['jsx-runtime'],
    TSESLint.configs.recommended,
    Import.flatConfigs.recommended,
    Import.flatConfigs.typescript,
    {
        files: ['**/*.?(m)@(j|t)s?(x)'],
        ...React.configs.flat.recommended,
    },
    {
        files: ['**/*.?(m)@(j|t)s?(x)'],
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
            'import/ignore': ['node_modules/react-native/index\\.js$'],
        },
        rules: {
            'react/jsx-curly-brace-presence': 'warn',
            'react/jsx-indent': 'off',
            'react/jsx-uses-react': 'error',
            'react/no-unescaped-entities': 'off',

            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
            '@typescript-eslint/no-undef': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-type': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-require-imports': 'off',

            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'type',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'unknown',
                    ],
                    pathGroups: [
                        {
                            group: 'builtin',
                            position: 'before',
                            pattern: 'react-native',
                        },
                        {
                            group: 'builtin',
                            position: 'before',
                            pattern: 'react',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['react', 'react-native'],
                    alphabetize: {
                        order: 'asc',
                    },
                    'newlines-between': 'never',
                },
            ],
            'import/no-unresolved': [
                'error',
                {
                    commonjs: true,
                },
            ],
            'import/prefer-default-export': 'off',
            'import/no-default-export': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-named-as-default': 'off',
        },
    },
);
