import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

const PALETTE = '(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)';
const COLOR_UTILS = '(bg|text|border|ring|fill|stroke|from|to|via|outline|decoration|divide|shadow|accent|caret|placeholder)';

export default [
    { ignores: ['dist/**', 'node_modules/**', 'fixture/**', 'docs/public/wp/**', 'docs/build/**', '**/.react-router/**', 'baseline/**', 'office/**', '*.tgz'] },
    js.configs.recommended,
    ...tseslint.configs.recommended.map((config) => ({ ...config, files: ['**/*.{ts,tsx}'] })),
    reactHooks.configs.flat['recommended-latest'],
    jsxA11y.flatConfigs.recommended,
    {
        files: ['**/*.{js,jsx,mjs,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: { ...globals.browser, ...globals.es2021 },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_|^[A-Z]', caughtErrors: 'none' }],
            'no-restricted-syntax': [
                'error',
                {
                    selector: `Literal[value=/(^|[\\s"'\`:(])${COLOR_UTILS}-${PALETTE}-[0-9]{2,3}(\\/[0-9]+)?(\\s|$|"|')/]`,
                    message: 'Hard-coded Tailwind palette colour. Components use the token contract only (theme.css).',
                },
                {
                    selector: 'Literal[value=/(^|\\s)!(text|bg|border|p|m|w|h|rounded|shadow|ring|opacity|flex|grid|block|hidden|font|gap|z)-?[a-z0-9]/]',
                    message: '`!` (important) utility. Products run Tailwind in important mode; resolve the conflict with cn().',
                },
            ],
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_|^[A-Z]', caughtErrors: 'none' }],
        },
    },
    {
        // Stock shadcn output: it owns raw elements and Radix wiring the a11y plugin cannot see through.
        files: ['src/components/**/*.tsx'],
        rules: {
            'jsx-a11y/click-events-have-key-events': 'off',
            'jsx-a11y/no-noninteractive-element-interactions': 'off',
            'jsx-a11y/anchor-has-content': 'off',
            'jsx-a11y/heading-has-content': 'off',
            'jsx-a11y/label-has-associated-control': 'off',
            'react-hooks/purity': 'off',
        },
    },
    {
        files: ['scripts/**', 'bin/**', '*.config.{js,ts}', 'tests/**', 'docs/*.{js,ts}', 'docs/lib/**'],
        languageOptions: { globals: { ...globals.node, ...globals.browser } },
    },
    {
        files: ['tests/**', 'examples/**', 'docs/**'],
        rules: { 'jsx-a11y/label-has-associated-control': 'off', 'jsx-a11y/no-noninteractive-tabindex': 'off' },
    },
];
