import { writable } from 'svelte/store';

// Create a writable store to hold the dark mode state
export const isDarkMode = writable(false);

// Function to toggle the dark mode state
export function toggleTheme() {
	isDarkMode.update((current) => {
		const newMode = !current;
		localStorage.setItem('theme', newMode ? 'dark' : 'light');
		return newMode;
	});
}

// Initialize the store based on localStorage value
export function initializeTheme() {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		isDarkMode.set(savedTheme === 'dark');
	}
}
