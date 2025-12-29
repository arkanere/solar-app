import { writable, derived, get } from 'svelte/store';
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
 * @param {'light' | 'dark' | 'system'} theme
 */
function applyTheme(theme) {
  if (!browser) return;

  const root = document.documentElement;
  const isDark = theme === THEMES.DARK ||
    (theme === THEMES.SYSTEM && systemPrefersDark());

  root.classList.remove('light', 'dark');
  root.classList.add(isDark ? 'dark' : 'light');
}

/**
 * Create the theme store
 */
function createThemeStore() {
  const { subscribe, set, update } = writable(getInitialTheme());

  return {
    subscribe,

    /**
     * Set a specific theme
     * @param {'light' | 'dark' | 'system'} theme
     */
    setTheme: (theme) => {
      set(theme);
      if (browser) {
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
      }
    },

    /**
     * Toggle between light and dark (ignores system)
     */
    toggle: () => {
      update(current => {
        const next = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        if (browser) {
          localStorage.setItem(STORAGE_KEY, next);
          applyTheme(next);
        }
        return next;
      });
    },

    /**
     * Initialize theme on app start
     * Call this in root +layout.svelte onMount
     */
    initialize: () => {
      if (!browser) return;

      const theme = getInitialTheme();
      applyTheme(theme);

      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        const current = get({ subscribe });
        if (current === THEMES.SYSTEM) {
          applyTheme(THEMES.SYSTEM);
        }
      };

      mediaQuery.addEventListener('change', handler);

      // Return cleanup function
      return () => mediaQuery.removeEventListener('change', handler);
    }
  };
}

/**
 * Main theme store
 * Values: 'light' | 'dark' | 'system'
 */
export const theme = createThemeStore();

/**
 * Derived store that returns true if dark mode is active
 * This maintains backward compatibility with existing components
 * that use `$isDarkMode` boolean checks
 */
export const isDarkMode = derived(theme, ($theme) => {
  if (!browser) return false;
  return $theme === THEMES.DARK ||
    ($theme === THEMES.SYSTEM && systemPrefersDark());
});

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
