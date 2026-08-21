// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierPlugin from 'eslint-plugin-prettier'; // Adds "prettier/prettier" rule
import prettierConfig from 'eslint-config-prettier/flat'; // Disables ESLint rules conflicting with Prettier
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
    // 🔹 Next.js Core Web Vitals + TypeScript rules
    // eslint-config-next@16.3.x internally registers @typescript-eslint plugin and parser
    ...nextVitals,
    ...nextTs,
    prettierConfig, // Spread Prettier config to disable conflicting rules

    {
        plugins: {
            import: importPlugin,
            react: reactPlugin,
            // ⚠️ Do NOT redefine @typescript-eslint here — nextTs already registers it.
            // Redefining it causes a "Cannot redefine plugin" ConfigError.
            prettier: prettierPlugin, // Enables "prettier/prettier" rule
        },

        settings: {
            // 🟦 Auto import resolver for TypeScript path aliases (@/*)
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                    alwaysTryTypes: true,
                },
            },
        },

        // 🟩 Target files
        files: ['src/**/*.{ts,tsx,js,jsx}'],

        languageOptions: {
            // ⚠️ Do NOT redefine parser here — nextTs already configures @typescript-eslint/parser.
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd(),
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        /* ------------------------------------------
         *  ⭐ PRETTIER + FORMAT RULES
         * ------------------------------------------ */
        rules: {
            'prettier/prettier': 'error',
            // ⚠️ Do NOT define 'indent' here — eslint-config-prettier disables it
            // because Prettier owns indentation (tabWidth: 4 in prettier.config.js).
            // Having both causes ESLintCircularFixesWarning during --fix.
            '@typescript-eslint/no-explicit-any': 'error',
            'react-hooks/set-state-in-effect': 'error',
            'func-style': ['error', 'expression', { allowArrowFunctions: true }],

            /* ------------------------------------------
             *  ⭐ TYPE-SCRIPT NAMING RULES
             * ------------------------------------------ */
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'variable',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'variable',
                    modifiers: ['const'],
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'variable',
                    types: ['function'],
                    modifiers: ['const'],
                    format: ['camelCase', 'PascalCase'],
                },
                { selector: 'typeLike', format: ['PascalCase'] },
                {
                    selector: 'variable',
                    types: ['boolean'],
                    format: ['PascalCase'],
                    prefix: ['is', 'has', 'can'],
                },
            ],

            /* ------------------------------------------
             * ⭐ REACT RULES (optimized for Next.js)
             * ------------------------------------------ */
            'react/jsx-uses-vars': 'error',
            'react/jsx-pascal-case': 'error',
            'react/function-component-definition': [
                'error',
                {
                    namedComponents: 'arrow-function',
                    unnamedComponents: 'arrow-function',
                },
            ],

            /* ------------------------------------------
             * ⭐ CLEAN CODE RULES
             * ------------------------------------------ */
            'no-console': 'warn',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-var': 'error',

            /* ------------------------------------------
             * ⭐ IMPORT RULES
             * ------------------------------------------ */
            'import/no-unresolved': 'error',
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            'import/order': [
                'error',
                {
                    groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
    // 🟥 Ignore directories
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),
]);
