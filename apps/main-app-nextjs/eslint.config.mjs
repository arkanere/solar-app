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
 * The two rules the README named as blocked on the layout primitives — "no
 * hand-rolled containers" and spacing-scale enforcement — landed with them and
 * are `primitiveRestrictions` below.
 */

/** Colour literals belong in the token layer, never inline in a component. */
const HEX_COLOUR = String.raw`(^|[\s:(,;])#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b`;

/** No dark mode exists in this app; :root pins color-scheme: light. */
const DARK_VARIANT = String.raw`(^|[\s"'\x60])dark:`;

/**
 * A hand-rolled container. `mx-auto` alone is the whole test: a container is a
 * column centred in the viewport, so every hand-rolled one centres, and
 * nothing else on a page has a reason to.
 *
 * A bare `max-w-*` with no centring is deliberately NOT caught. Capping a
 * paragraph or a form at a readable width inside a wider section is a
 * typographic decision, and routing it through Container would be wrong — a
 * nested Container would add a second page gutter.
 */
const HAND_ROLLED_CONTAINER = String.raw`(^|[\s"'\x60])mx-auto(?![\w-])`;

/**
 * Tailwind's numeric spacing scale. The token scale is 2xs…3xl, so anything
 * ending in a bare number is off-scale by construction. The lookahead is what
 * keeps `gap-2xs` and `mt-3xl` out of this — without it, the digit in `2xs`
 * matches and every token use is a false positive.
 */
const NUMERIC_SPACING = String.raw`(^|[\s"'\x60])-?([mp][trblxyse]?|gap(-[xy])?|space-[xy])-\d+(\.\d+)?(?![\w-])`;

/** Applies everywhere, including inside the layout primitives. */
const baseRestrictions = [
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
];

/**
 * Everywhere EXCEPT components/layout, which is the code these two rules point
 * at. The primitives have to write `mx-auto` and the gutter themselves; the
 * whole point is that nothing else does.
 */
const primitiveRestrictions = [
  {
    selector: `Literal[value=/${HAND_ROLLED_CONTAINER}/]`,
    message:
      'No hand-rolled containers. Use <Section>, <Container> or <PageShell> from @/components/layout — measure and page gutter are one decision, made once, not re-typed per page.'
  },
  {
    selector: `TemplateElement[value.raw=/${HAND_ROLLED_CONTAINER}/]`,
    message: 'No hand-rolled containers. Use <Section> or <Container> from @/components/layout.'
  },
  {
    selector: `Literal[value=/${NUMERIC_SPACING}/]`,
    message:
      "Off the spacing scale. Use a token step — 2xs xs sm md lg xl 2xl 3xl — e.g. `mt-lg`, not `mt-6`. Vertical rhythm between blocks belongs to <Stack> rather than to margins at all."
  },
  {
    selector: `TemplateElement[value.raw=/${NUMERIC_SPACING}/]`,
    message: 'Off the spacing scale. Use a token step (2xs…3xl), e.g. `mt-lg`, not `mt-6`.'
  }
];

/**
 * RSC is the default. Every 'use client' is a deliberate exception at an
 * interactive leaf, so each one has to be disabled explicitly — the
 * eslint-disable comment is where the justification gets written down.
 */
const USE_CLIENT_RESTRICTION = {
  selector: 'ExpressionStatement > Literal[value="use client"]',
  message:
    'Server components are the default. If this really is an interactive leaf, keep the directive and add an eslint-disable-next-line comment saying why.'
};

const designRules = {
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

      'no-restricted-syntax': [
        'error',
        ...baseRestrictions,
        ...primitiveRestrictions,
        USE_CLIENT_RESTRICTION
      ]
    }
  },

  // The layout primitives are the code the two rules above point at, so they
  // are the one place allowed to write `mx-auto` and the page gutter. Every
  // other restriction still applies here — hence the list is restated minus
  // primitiveRestrictions, rather than the whole rule being switched off.
  {
    files: ['components/layout/**/*.tsx'],
    rules: {
      'no-restricted-syntax': ['error', ...baseRestrictions, USE_CLIENT_RESTRICTION]
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

  // Reporting CLIs. stdout IS the output here, so no-console is the wrong rule.
  {
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' }
  },

  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts']
  }
];
