/**
 * The directory surface — archetypes 1–3, 90.5% of the site's URLs.
 *
 * All server components. The only interactive leaves the geo listing needs are
 * the lead form (not yet ported) and nothing else: the contact buttons are
 * anchors, so they render on the server like the rest of the row.
 */
export { Breadcrumb, type Crumb } from './Breadcrumb';
export { CityChips } from './CityChips';
export { CallButton, WhatsAppButton } from './ContactButtons';
export { InstallerList } from './InstallerList';
export { InstallerRow } from './InstallerRow';
export { PlaceHeader } from './PlaceHeader';
export { SoleInstaller } from './SoleInstaller';
export { WorkThumb } from './WorkThumb';
