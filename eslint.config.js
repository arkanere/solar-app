import js from '@eslint/js';
import globals from 'globals';
import sveltePlugin from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';

/**
 * Flat ESLint config shared across the monorepo.
 *
 * Parsing setup (Svelte 5 + TypeScript):
 * - `.ts`/`.svelte.ts` files are parsed with `@typescript-eslint/parser`.
 * - `.svelte` files use `svelte-eslint-parser`, told to hand `<script lang="ts">`
 *   blocks to the TS parser via `parserOptions.parser`.
 * We intentionally do NOT enable the full `typescript-eslint` ruleset here — this config
 * only makes lint *parse* Svelte 5 + TS correctly and applies our lightweight rules.
 * `no-undef` is disabled for TS/Svelte files because TypeScript and svelte-check already
 * verify undefined references (and it false-positives on types and Svelte 5 runes).
 */
export default [
	// Base JavaScript configuration
	js.configs.recommended,

	// Svelte plugin recommended configs
	...sveltePlugin.configs['flat/recommended'],

	// Plain JavaScript files
	{
		files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
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
			'no-unused-vars': ['warn', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_'
			}],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'prefer-const': 'warn',
			'no-var': 'error'
		}
	},

	// TypeScript files (including `*.svelte.ts` rune modules)
	{
		files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.svelte.ts'],
		languageOptions: {
			parser: tseslint.parser,
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.es2021,
				...globals.node
			}
		},
		rules: {
			// TypeScript itself checks these; espree's versions false-positive on TS syntax.
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'prefer-const': 'warn',
			'no-var': 'error'
		}
	},

	// Svelte component files — parse `<script lang="ts">` with the TS parser
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			},
			globals: {
				...globals.browser,
				...globals.es2021
			}
		},
		rules: {
			// TypeScript/svelte-check own undefined checks; runes ($state/$props/…) are
			// compiler globals that no-undef doesn't know about.
			'no-undef': 'off',
			'svelte/no-unused-svelte-ignore': 'warn',
			'svelte/no-at-html-tags': 'warn',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			// Disable navigation resolve rule for legacy code - can be enabled gradually
			'svelte/no-navigation-without-resolve': 'off',
			// Downgrade each-key requirement to warning
			'svelte/require-each-key': 'warn',
			// Style/best-practice rule — downgrade to warn (false-positives on computed
			// Maps/Sets that aren't reactive state). Consistent with the rules above.
			'svelte/prefer-svelte-reactivity': 'warn'
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
			// Vendored/generated shadcn-style UI components (bits-ui) — not hand-maintained.
			'**/src/lib/components/ui/**',
			// Two pages hit svelte-eslint-parser limitations the Svelte compiler itself does
			// not (they build & render fine): a multi-line inline JSON-LD object mixed with
			// real <script> ld+json elements, and an inline <script> block in markup.
			// Escaping/refactoring risked the production SEO output, so they are skipped here.
			'**/routes/in/(layout-1)/+page.svelte',
			'**/routes/in/(layout-1)/partners/+page.svelte'
		]
	}
];
