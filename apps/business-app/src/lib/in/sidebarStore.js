import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Get initial state from localStorage if available
const getInitialState = () => {
	if (browser) {
		const stored = localStorage.getItem('sidebarExpanded');
		if (stored !== null) {
			return JSON.parse(stored);
		}
	}
	// Default to expanded on desktop
	return browser ? window.innerWidth >= 1024 : true;
};

// Create the store
function createSidebarStore() {
	const { subscribe, set, update } = writable(getInitialState());

	return {
		subscribe,
		toggle: () => {
			update((expanded) => {
				const newState = !expanded;
				if (browser) {
					localStorage.setItem('sidebarExpanded', JSON.stringify(newState));
				}
				return newState;
			});
		},
		expand: () => {
			set(true);
			if (browser) {
				localStorage.setItem('sidebarExpanded', 'true');
			}
		},
		collapse: () => {
			set(false);
			if (browser) {
				localStorage.setItem('sidebarExpanded', 'false');
			}
		},
		set: (value) => {
			set(value);
			if (browser) {
				localStorage.setItem('sidebarExpanded', JSON.stringify(value));
			}
		}
	};
}

export const isSidebarExpanded = createSidebarStore();

// Mobile menu state (separate from sidebar expand/collapse)
export const isMobileMenuOpen = writable(false);

// Collapsible sections state management
const getInitialExpandedSections = () => {
	if (browser) {
		const stored = localStorage.getItem('expandedSections');
		if (stored) {
			return JSON.parse(stored);
		}
	}
	return {}; // All collapsed by default
};

function createExpandedSectionsStore() {
	const { subscribe, update } = writable(getInitialExpandedSections());

	return {
		subscribe,
		toggle: (sectionId) => {
			update((sections) => {
				const newSections = { ...sections, [sectionId]: !sections[sectionId] };
				if (browser) {
					localStorage.setItem('expandedSections', JSON.stringify(newSections));
				}
				return newSections;
			});
		}
	};
}

export const expandedSections = createExpandedSectionsStore();
