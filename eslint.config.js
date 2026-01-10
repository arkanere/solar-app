import js from '@eslint/js';
import globals from 'globals';
import sveltePlugin from 'eslint-plugin-svelte';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	// Base JavaScript configuration
	js.configs.recommended,

	// Svelte plugin recommended configs
	...sveltePlugin.configs['flat/recommended'],

	// Custom configuration for JavaScript/TypeScript files
	{
		files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.es2021,
				...globals.node
			}
		},
		rules: {
			// Customize rules as needed
			'no-unused-vars': ['warn', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_'
			}],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'prefer-const': 'warn',
			'no-var': 'error'
		}
	},

	// Custom configuration for Svelte files
	{
		files: ['**/*.svelte'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2021
			}
		},
		rules: {
			// Svelte-specific customizations
			'svelte/no-unused-svelte-ignore': 'warn',
			'svelte/no-at-html-tags': 'warn',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			// Disable navigation resolve rule for legacy code - can be enabled gradually
			'svelte/no-navigation-without-resolve': 'off',
			// Downgrade each-key requirement to warning
			'svelte/require-each-key': 'warn'
		}
	},

	// Ignore patterns
	{
		ignores: [
			'**/node_modules/**',
			'**/.svelte-kit/**',
			'**/build/**',
			'**/dist/**',
			'**/.vercel/**',
			'**/.next/**',
			'**/coverage/**',
			'**/.env',
			'**/.env.*',
			'**/package-lock.json',
			'**/pnpm-lock.yaml',
			'**/yarn.lock',
			// Ignore business-app UI components (Svelte 5 - not fully supported by ESLint yet)
			'**/apps/business-app/src/lib/components/ui/**'
		]
	}
];
