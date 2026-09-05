import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * Flat ESLint config for main-app-nextjs.
 *
 * This app does NOT use the monorepo's root `eslint.config.js`. That config is
 * built for Svelte 5 and has no block matching `**\/*.tsx`, so before this file
 * existed `eslint .` here exited 0 having linted zero files.
 *
 * Two jobs:
 *  1. Parse and check TSX the way Next expects (core-web-vitals + react-hooks).
 *  2. Lock in the design rules from README.md, so the constraints are enforced
 *     from the first commit rather than retrofitted — which is exactly what went
 *     wrong in the SvelteKit app.
 *
 * The design rules below are only the ones decidable today. Two more are named
 * in the README and deliberately absent, because they cannot be written yet:
 *  - "no hand-rolled containers" needs the layout primitives to exist before
 *    there is a named thing to require instead.
 *  - spacing/type scale enforcement needs the token set, which is decided as one
 *    argument in the design foundation step.
 * Add both here as they land.
 */

/** Colour literals belong in the token layer, never inline in a component. */
const HEX_COLOUR = String.raw`(^|[\s:(,;])#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b`;

/** No dark mode exists in this app; :root pins color-scheme: light. */
const DARK_VARIANT = String.raw`(^|[\s"'\x60])dark:`;

const designRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector: `Literal[value=/${DARK_VARIANT}/]`,
      message:
        'No dark mode in this app — :root pins color-scheme: light, so `dark:` has nothing to flip. Authoring two themes separately is what made the SvelteKit tokens drift.'
    },
    {
      selector: `TemplateElement[value.raw=/${DARK_VARIANT}/]`,
      message:
        'No dark mode in this app — :root pins color-scheme: light, so `dark:` has nothing to flip.'
    },
    {
      selector: `Literal[value=/${HEX_COLOUR}/]`,
      message:
        'No raw hex outside the token layer. Use a token from globals.css (or a daisyUI colour class) so the palette stays changeable in one place.'
    },
    {
      selector: `TemplateElement[value.raw=/${HEX_COLOUR}/]`,
      message: 'No raw hex outside the token layer. Use a token from globals.css.'
    }
  ],

  'no-restricted-imports': [
    'error',
    {
      paths: [
        'framer-motion',
        'motion',
        'motion/react',
        'gsap',
        '@gsap/react',
        'react-spring',
        '@react-spring/web',
        'animejs',
        'lottie-react',
        '@lottiefiles/react-lottie-player'
      ].map((name) => ({
        name,
        message:
          'CSS transitions via Tailwind only — no JS animation libraries. They ship runtime weight onto a content site whose pixels are type, whitespace and images.'
      }))
    }
  ]
};

export default [
  js.configs.recommended,

  // Registered unscoped on purpose. Next's build-time lint check calls
  // `calculateConfigForFile()` on this config file and looks for '@next/next'
  // in the plugins it resolves to; a plugin registered only under a
  // `files: ['**/*.tsx']` block is invisible to that check, and `next build`
  // warns "The Next.js plugin was not detected" even though the rules are live.
  // Registering here changes nothing about which files the rules apply to —
  // that is still the block below.
  { plugins: { '@next/next': nextPlugin } },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.es2021, ...globals.node }
    },
    plugins: {
      '@next/next': nextPlugin,
      ...reactHooks.configs['recommended-latest'].plugins
    },
    rules: {
      ...nextPlugin.flatConfig.coreWebVitals.rules,
      ...reactHooks.configs['recommended-latest'].rules,

      // TypeScript already checks these, and espree's versions false-positive on
      // TS syntax. Matches the root config's reasoning.
      'no-undef': 'off',
      'no-unused-vars': 'off',

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',

      ...designRules,

      // RSC is the default. Every 'use client' is a deliberate exception at an
      // interactive leaf, so each one has to be disabled explicitly — the
      // eslint-disable comment is where the justification gets written down.
      'no-restricted-syntax': [
        ...designRules['no-restricted-syntax'],
        {
          selector: 'ExpressionStatement > Literal[value="use client"]',
          message:
            "Server components are the default. If this really is an interactive leaf, keep the directive and add an eslint-disable-next-line comment saying why."
        }
      ]
    }
  },

  {
    files: ['**/*.mjs', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2021 }
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error'
    }
  },

  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts']
  }
];
