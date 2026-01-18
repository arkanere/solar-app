import { browser } from '$app/environment';

const STORAGE_KEY = 'theme';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme options
 */
export const THEMES = {
	LIGHT: 'light',
	DARK: 'dark',
	SYSTEM: 'system'
} as const;

/**
 * Get the initial theme from localStorage or default to system
 */
function getInitialTheme(): Theme {
	if (!browser) return THEMES.LIGHT;

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && Object.values(THEMES).includes(stored as Theme)) {
		return stored as Theme;
	}
	return THEMES.SYSTEM;
}

/**
 * Check if system prefers dark mode
 */
function systemPrefersDark(): boolean {
	if (!browser) return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply theme classes to document
 */
function applyTheme(themeValue: Theme): void {
	if (!browser) return;

	const root = document.documentElement;
	const isDark =
		themeValue === THEMES.DARK || (themeValue === THEMES.SYSTEM && systemPrefersDark());

	root.classList.remove('light', 'dark');
	root.classList.add(isDark ? 'dark' : 'light');
}

// Svelte 5 reactive state
let themeValue = $state<Theme>(getInitialTheme());

type Unsubscriber = () => void;

interface ThemeStore {
	readonly value: Theme;
	subscribe(fn: (value: Theme) => void): Unsubscriber;
	setTheme(newTheme: Theme): void;
	toggle(): void;
	initialize(): Unsubscriber | void;
}

/**
 * Main theme store using Svelte 5 runes
 * Values: 'light' | 'dark' | 'system'
 */
export const theme: ThemeStore = {
	/**
	 * Get current theme value
	 */
	get value(): Theme {
		return themeValue;
	},

	/**
	 * Subscribe to theme changes (for backwards compatibility)
	 */
	subscribe(fn: (value: Theme) => void): Unsubscriber {
		// Initial call
		fn(themeValue);

		// Return unsubscribe function
		// Note: In Svelte 5 with runes, reactivity is automatic
		// This is mainly for backwards compatibility
		return () => {};
	},

	/**
	 * Set a specific theme
	 */
	setTheme(newTheme: Theme): void {
		themeValue = newTheme;
		if (browser) {
			localStorage.setItem(STORAGE_KEY, newTheme);
			applyTheme(newTheme);
		}
	},

	/**
	 * Toggle between light and dark (ignores system)
	 */
	toggle(): void {
		const next = themeValue === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
		themeValue = next;
		if (browser) {
			localStorage.setItem(STORAGE_KEY, next);
			applyTheme(next);
		}
	},

	/**
	 * Initialize theme on app start
	 * Call this in root +layout.svelte onMount
	 */
	initialize(): Unsubscriber | void {
		if (!browser) return;

		const initialTheme = getInitialTheme();
		themeValue = initialTheme;
		applyTheme(initialTheme);

		// Listen for system preference changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = (): void => {
			if (themeValue === THEMES.SYSTEM) {
				applyTheme(THEMES.SYSTEM);
			}
		};

		mediaQuery.addEventListener('change', handler);

		// Return cleanup function
		return () => mediaQuery.removeEventListener('change', handler);
	}
};

/**
 * Computed value for dark mode status (Svelte 5 runes)
 */
const isDark = $derived(
	themeValue === THEMES.DARK || (themeValue === THEMES.SYSTEM && systemPrefersDark())
);

interface DarkModeStore {
	readonly current: boolean;
	subscribe(fn: (value: boolean) => void): Unsubscriber;
}

/**
 * Store-compatible interface for isDarkMode
 * Provides backwards compatibility with `$isDarkMode` syntax
 * while using Svelte 5 runes internally
 */
export const isDarkMode: DarkModeStore = {
	/**
	 * Get current dark mode status
	 */
	get current(): boolean {
		return isDark;
	},

	/**
	 * Subscribe to dark mode changes
	 * Required for Svelte store `$` auto-subscription syntax
	 */
	subscribe(fn: (value: boolean) => void): Unsubscriber {
		// Create an effect to track changes and notify subscribers
		const cleanup = $effect.root(() => {
			$effect(() => {
				fn(isDark);
			});
		});

		// Return unsubscribe function
		return cleanup;
	}
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use theme.toggle() instead
 */
export function toggleTheme(): void {
	theme.toggle();
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use theme.initialize() instead
 */
export function initializeTheme(): Unsubscriber | void {
	theme.initialize();
}
