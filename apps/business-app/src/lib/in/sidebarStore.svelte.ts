import { browser } from '$app/environment';

/** Get initial sidebar state from localStorage or default based on screen width */
const getInitialState = (): boolean => {
	if (browser) {
		const stored = localStorage.getItem('sidebarExpanded');
		if (stored !== null) {
			return JSON.parse(stored);
		}
	}
	// Default to expanded on desktop
	return browser ? window.innerWidth >= 1024 : true;
};

/** Get initial expanded sections state from localStorage */
const getInitialExpandedSections = (): Record<string, boolean> => {
	if (browser) {
		const stored = localStorage.getItem('expandedSections');
		if (stored) {
			return JSON.parse(stored);
		}
	}
	return {}; // All collapsed by default
};

/** Sidebar state management with Svelte 5 runes */
class SidebarState {
	isExpanded = $state(getInitialState());

	/** Toggle sidebar between expanded and collapsed */
	toggle() {
		this.isExpanded = !this.isExpanded;
		if (browser) {
			localStorage.setItem('sidebarExpanded', JSON.stringify(this.isExpanded));
		}
	}

	/** Expand the sidebar */
	expand() {
		this.isExpanded = true;
		if (browser) {
			localStorage.setItem('sidebarExpanded', 'true');
		}
	}

	/** Collapse the sidebar */
	collapse() {
		this.isExpanded = false;
		if (browser) {
			localStorage.setItem('sidebarExpanded', 'false');
		}
	}

	/** Set sidebar state to specific value */
	set(value: boolean) {
		this.isExpanded = value;
		if (browser) {
			localStorage.setItem('sidebarExpanded', JSON.stringify(value));
		}
	}
}

/** Mobile menu state management with Svelte 5 runes */
class MobileMenuState {
	isOpen = $state(false);

	/** Toggle mobile menu open/closed */
	toggle() {
		this.isOpen = !this.isOpen;
	}

	/** Open the mobile menu */
	open() {
		this.isOpen = true;
	}

	/** Close the mobile menu */
	close() {
		this.isOpen = false;
	}

	/** Set mobile menu state to specific value */
	set(value: boolean) {
		this.isOpen = value;
	}
}

/** Collapsible sections state management with Svelte 5 runes */
class ExpandedSectionsState {
	sections = $state<Record<string, boolean>>(getInitialExpandedSections());

	/** Toggle specific section's expansion state */
	toggle(sectionId: string) {
		this.sections = {
			...this.sections,
			[sectionId]: !this.sections[sectionId]
		};
		if (browser) {
			localStorage.setItem('expandedSections', JSON.stringify(this.sections));
		}
	}

	/** Check if a section is expanded */
	isExpanded(sectionId: string): boolean {
		return !!this.sections[sectionId];
	}
}

export const isSidebarExpanded = new SidebarState();
export const isMobileMenuOpen = new MobileMenuState();
export const expandedSections = new ExpandedSectionsState();
