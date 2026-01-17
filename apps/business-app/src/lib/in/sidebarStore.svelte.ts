let sidebarExpanded = $state(true);
let mobileMenuOpen = $state(false);
let expandedSectionsState: Record<string, boolean> = $state({});

export const isSidebarExpanded = {
	get isExpanded() {
		return sidebarExpanded;
	},
	toggle: () => {
		sidebarExpanded = !sidebarExpanded;
	},
	set: (value: boolean) => {
		sidebarExpanded = value;
	}
};

export const isMobileMenuOpen = {
	get isOpen() {
		return mobileMenuOpen;
	},
	toggle: () => {
		mobileMenuOpen = !mobileMenuOpen;
	},
	set: (value: boolean) => {
		mobileMenuOpen = value;
	}
};

export const expandedSections = {
	get sections() {
		return expandedSectionsState;
	},
	toggle: (sectionId: string) => {
		expandedSectionsState[sectionId] = !expandedSectionsState[sectionId];
	}
};
