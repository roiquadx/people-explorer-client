import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
    // Ignore generated/output
    { ignores: ['dist/**', 'node_modules/**'] },

    // Base JS recommended
    js.configs.recommended,

    // TypeScript (no type-aware linting by default to keep it fast)
    ...tseslint.configs.recommended,

    // Vue (Vue 3)
    ...vue.configs['flat/recommended'],

    // Prettier should win over stylistic rules
    prettierConfig,

    {
        files: ['**/*.{ts,tsx,vue}'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        rules: {
            // Pragmatic defaults
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',

            // Vue tweaks
            'vue/multi-word-component-names': 'off',
            'vue/no-mutating-props': 'error',

            // TS tweaks
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }]
        }
    }
];
