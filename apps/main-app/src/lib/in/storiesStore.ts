import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Story } from '$lib/types/api';

// Global store to manage stories modal state
export const storiesModalOpen: Writable<boolean> = writable(false);
export const storiesData: Writable<Story[]> = writable([]);
export const storiesLoading: Writable<boolean> = writable(false);
export const storiesError: Writable<string | null> = writable(null);


// Function to open stories modal
export function openStoriesModal(): void {
	storiesModalOpen.set(true);
}

// Function to close stories modal
export function closeStoriesModal(): void {
	storiesModalOpen.set(false);
}

// Function to load stories data
export async function loadStoriesData(): Promise<void> {
	storiesLoading.set(true);
	storiesError.set(null);

	try {
		const response = await fetch('/in/api/stories');
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
		storiesError.set(error instanceof Error ? error.message : 'Unknown error');
		storiesData.set([]);
	} finally {
		storiesLoading.set(false);
	}
}
