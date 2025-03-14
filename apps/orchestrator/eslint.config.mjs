import Import from 'eslint-plugin-import';
import TSESLint from 'typescript-eslint';
import BaseConfig from '../../eslint.config.mjs';

export default TSESLint.config(
    ...TSESLint.configs.recommended,
    Import.flatConfigs.recommended,
    Import.flatConfigs.typescript,
    ...BaseConfig,
    {
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        rules: {
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
            '@typescript-eslint/no-undef': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-type': 'off',
            '@typescript-eslint/no-empty-function': 'off',

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
                    alphabetize: {
                        order: 'asc',
                    },
                    'newlines-between': 'never',
                },
            ],
            'import/no-unresolved': 'error',
            'import/prefer-default-export': 'off',
            'import/no-default-export': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-named-as-default': 'off',
        },
    },
);
