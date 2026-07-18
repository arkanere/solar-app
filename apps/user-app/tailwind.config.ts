import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 configuration.
 *
 * Theme tokens live in the `@theme` block in `src/app.css` (CSS-first).
 * This file only declares the content globs Tailwind scans for class names.
 */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}']
} satisfies Config;
