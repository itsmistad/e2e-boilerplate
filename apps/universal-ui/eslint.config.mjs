import { fixupPluginRules } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import EslintComments from 'eslint-plugin-eslint-comments';
import Import from 'eslint-plugin-import';
import Jest from 'eslint-plugin-jest';
import React from 'eslint-plugin-react';
import ReactHooks from 'eslint-plugin-react-hooks';
import ReactNative from 'eslint-plugin-react-native';
import TSESLint from 'typescript-eslint';
import BaseConfig from '../../eslint.config.mjs';

export default defineConfig(
    ...BaseConfig,
    {
        // update this to match your test files
        files: ['**/*.spec.{ts,tsx}'],
        plugins: { jest: Jest },
        languageOptions: {
            globals: Jest.environments.globals.globals,
        },
        rules: {
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',
        },
    },
    {
        plugins: {
            'eslint-comments': fixupPluginRules(EslintComments),
            'react-native': fixupPluginRules(ReactNative),
            'react-hooks': ReactHooks,
        },
        settings: {
            react: {
                createClass: 'createReactClass', // Regex for Component Factory to use,
                // default to "createReactClass"
                pragma: 'React', // Pragma to use, default to "React"
                fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
                version: 'detect', // React version. "detect" automatically picks the version you have installed.
                // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                // Defaults to the "defaultVersion" setting and warns if missing, and to "detect" in the future
                defaultVersion: '', // Default React version to use when the version you have installed cannot be detected.
                // If not provided, defaults to the latest React version.
                flowVersion: '0.53', // Flow version
            },
            propWrapperFunctions: [
                // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
                'forbidExtraProps',
                { property: 'freeze', object: 'Object' },
                { property: 'myFavoriteWrapper' },
                // for rules that check exact prop wrappers
                { property: 'forbidExtraProps', exact: true },
            ],
            componentWrapperFunctions: [
                // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
                'observer', // `property`
                { property: 'styled' }, // `object` is optional
                { property: 'observer', object: 'Mobx' },
                { property: 'observer', object: '<pragma>' }, // sets `object` to whatever value `settings.react.pragma` is set to
            ],
            formComponents: [
                // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
                'CustomForm',
                { name: 'SimpleForm', formAttribute: 'endpoint' },
                { name: 'Form', formAttribute: ['registerEndpoint', 'loginEndpoint'] }, // allows specifying multiple properties if necessary
            ],
            linkComponents: [
                // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
                'Hyperlink',
                { name: 'MyLink', linkAttribute: 'to' },
                { name: 'Link', linkAttribute: ['to', 'href'] }, // allows specifying multiple properties if necessary
            ],
        },
    },
    React.configs.flat['jsx-runtime'],
    TSESLint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    Import.flatConfigs.recommended,
    Import.flatConfigs.typescript,
    {
        files: ['**/*.{js,ts,jsx,tsx,mjs,mts}', '**/*.spec.{ts,tsx}'],
        ...React.configs.flat.recommended,
    },
    {
        files: ['**/*.{js,ts,jsx,tsx,mjs,mts}', '**/*.spec.{ts,tsx}'],
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
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
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
    {
        ignores: [
            '**/web-build**',
            '**/.expo/*',
            '**/expo-env.d.ts',
            '**/.tamagui**',
            '**/*.orig.*',
            '**/*.jks',
            '**/*.p8',
            '**/*.p12',
            '**/*.key',
            '**/*.mobileprovision',
            '**/.metro-health-check**',
        ],
    },
);
