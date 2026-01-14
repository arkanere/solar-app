import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * Tailwind v4 Configuration
 *
 * Most theme tokens (colors, shadows, spacing, etc.) are defined in the @theme block
 * in app.css for better CSS-first architecture. This config only contains:
 * - content: File paths for scanning classes
 * - plugins: Essential plugins like tailwindcss-animate
 *
 * Note: darkMode defaults to 'class' in v4, no need to specify
 */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [tailwindcssAnimate]
} satisfies Config;
