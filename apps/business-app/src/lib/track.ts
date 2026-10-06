/**
 * Declarative click tracking. Spread `trackAttrs(...)` onto an element and the
 * document click listener in routes/+layout.svelte sends it.
 *
 * `data-track` is the PostHog event. `data-umami` is the Umami event.
 */
export function trackAttrs(
	event: string,
	props?: Record<string, unknown>,
	umami?: string
): Record<string, string> {
	const attrs: Record<string, string> = { 'data-track': event };
	if (props) attrs['data-track-props'] = JSON.stringify(props);
	if (umami) attrs['data-umami'] = umami;
	return attrs;
}
