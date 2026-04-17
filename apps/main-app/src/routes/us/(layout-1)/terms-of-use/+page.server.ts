// src/routes/(layout-1)/terms-of-use/+page.server.js

import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 1296000
	}
};

export const load: PageServerLoad = async () => {
	// This page is static legal content (terms of use)
	// ISR will cache the static content for performance
	return {
		user: null
	};
};