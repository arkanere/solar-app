// Application configuration
export const config = {
	country: 'in'
};

// Helper function to build URLs with country prefix
export function buildUrl(path) {
	return `/${config.country}${path}`;
}
