import { browser } from '$app/environment';

const STORAGE_KEY = 'theme';

/**
 * Theme options
 * @type {{ LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' }}
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

/**
 * Get the initial theme from localStorage or default to system
 * @returns {'light' | 'dark' | 'system'}
 */
function getInitialTheme() {
  if (!browser) return THEMES.LIGHT;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && Object.values(THEMES).includes(stored)) {
    return stored;
  }
  return THEMES.SYSTEM;
}

/**
 * Check if system prefers dark mode
 * @returns {boolean}
 */
function systemPrefersDark() {
  if (!browser) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply theme classes to document
 * @param {'light' | 'dark' | 'system'} themeValue
 */
function applyTheme(themeValue) {
  if (!browser) return;

  const root = document.documentElement;
  const isDark = themeValue === THEMES.DARK ||
    (themeValue === THEMES.SYSTEM && systemPrefersDark());

  root.classList.remove('light', 'dark');
  root.classList.add(isDark ? 'dark' : 'light');
}

// Svelte 5 reactive state
let themeValue = $state(getInitialTheme());

/**
 * Main theme store using Svelte 5 runes
 * Values: 'light' | 'dark' | 'system'
 */
export const theme = {
  /**
   * Get current theme value
   */
  get value() {
    return themeValue;
  },

  /**
   * Subscribe to theme changes (for backwards compatibility)
   * @param {(value: string) => void} fn
   */
  subscribe(fn) {
    // Initial call
    fn(themeValue);

    // Return unsubscribe function
    // Note: In Svelte 5 with runes, reactivity is automatic
    // This is mainly for backwards compatibility
    return () => {};
  },

  /**
   * Set a specific theme
   * @param {'light' | 'dark' | 'system'} newTheme
   */
  setTheme: (newTheme) => {
    themeValue = newTheme;
    if (browser) {
      localStorage.setItem(STORAGE_KEY, newTheme);
      applyTheme(newTheme);
    }
  },

  /**
   * Toggle between light and dark (ignores system)
   */
  toggle: () => {
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
  initialize: () => {
    if (!browser) return;

    const initialTheme = getInitialTheme();
    themeValue = initialTheme;
    applyTheme(initialTheme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
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
  themeValue === THEMES.DARK ||
  (themeValue === THEMES.SYSTEM && systemPrefersDark())
);

/**
 * Store-compatible interface for isDarkMode
 * Provides backwards compatibility with `$isDarkMode` syntax
 * while using Svelte 5 runes internally
 */
export const isDarkMode = {
  /**
   * Get current dark mode status
   */
  get current() {
    return isDark;
  },

  /**
   * Subscribe to dark mode changes
   * Required for Svelte store `$` auto-subscription syntax
   * @param {(value: boolean) => void} fn
   */
  subscribe(fn) {
    // Create an effect to track changes and notify subscribers
    let cleanup = $effect.root(() => {
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
export function toggleTheme() {
  theme.toggle();
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use theme.initialize() instead
 */
export function initializeTheme() {
  theme.initialize();
}
