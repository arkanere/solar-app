export function capitalizeCityName(city: string): string {
	return city
		.split(/([\s-])/g)
		.map((part) => {
			if (!part.match(/[\s-]/)) {
				return part.charAt(0).toUpperCase() + part.slice(1);
			}
			return part;
		})
		.join('');
}

export function slugToName(slug: string): string {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function mostRecentDate(dates: (string | Date | null | undefined)[]): string | null {
	const candidates = dates.filter(Boolean).map((d) => new Date(d!));
	return candidates.length > 0
		? new Date(Math.max(...candidates.map((d) => d.getTime()))).toISOString()
		: null;
}
