import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Create a writable store to hold the dark mode state
export const isDarkMode: Writable<boolean> = writable(false);

// Function to toggle the dark mode state
export function toggleTheme(): void {
	isDarkMode.update((current) => {
		const newMode = !current;
		localStorage.setItem('theme', newMode ? 'dark' : 'light');
		return newMode;
	});
}

// Initialize the store based on localStorage value
export function initializeTheme(): void {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		isDarkMode.set(savedTheme === 'dark');
	}
}
