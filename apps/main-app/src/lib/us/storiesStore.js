import { writable } from 'svelte/store';

// Global store to manage stories modal state
export const storiesModalOpen = writable(false);
export const storiesData = writable([]);
export const storiesLoading = writable(false);
export const storiesError = writable(null);

// Function to open stories modal
export function openStoriesModal() {
	storiesModalOpen.set(true);
}

// Function to close stories modal
export function closeStoriesModal() {
	storiesModalOpen.set(false);
}

// Function to load stories data
export async function loadStoriesData() {
	storiesLoading.set(true);
	storiesError.set(null);

	try {
		const response = await fetch('/us/api/stories');
		if (!response.ok) {
			throw new Error('Failed to load stories');
		}
		const data = await response.json();

		if (data.success) {
			storiesData.set(data.projects || []);
		} else {
			throw new Error(data.error || 'Failed to load stories');
		}
	} catch (error) {
		console.error('Error loading stories:', error);
		storiesError.set(error.message);
		storiesData.set([]);
	} finally {
		storiesLoading.set(false);
	}
}
