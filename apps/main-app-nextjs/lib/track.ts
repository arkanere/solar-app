/**
 * Click tracking for server-rendered links. A server component cannot take an
 * onClick, so it spreads `trackAttrs(...)` onto the element instead, and the
 * one document click listener in components/analytics/Analytics.tsx sends it.
 *
 * `data-track` is the PostHog event, gated on consent like PostHog itself.
 * `data-umami` is the Umami event, which is cookieless and not gated.
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
