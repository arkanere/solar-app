/**
 * The directory surface — archetypes 1–3, 90.5% of the site's URLs.
 *
 * Server components with one exception: `LeadForm`, five controlled fields
 * validating on blur, which `LeadFormSection` wraps so that only the fields
 * cross the client boundary. Everything else renders on the server — the
 * contact buttons are anchors and the FAQ is native `<details>`, so neither
 * needs JavaScript.
 */
export { BackLink } from './BackLink';
export { Breadcrumb, type Crumb } from './Breadcrumb';
export { ChipList, type Chip } from './ChipList';
export { CityChips } from './CityChips';
export { CallButton, WhatsAppButton } from './ContactButtons';
export { ContactPanel } from './ContactPanel';
export { CoverageBar } from './CoverageBar';
export { FAQ, type FaqEntry } from './FAQ';
export { InstallerList } from './InstallerList';
export { InstallerProjects } from './InstallerProjects';
export { InstallerRow } from './InstallerRow';
export { LeafHeader } from './LeafHeader';
export { LeadFormSection } from './LeadFormSection';
export { LocationGrid, type LocationCardData } from './LocationGrid';
export { Pager } from './Pager';
export { PlaceHeader } from './PlaceHeader';
export { ProjectGallery } from './ProjectGallery';
export { ProjectList } from './ProjectList';
export { QuoteCTA } from './QuoteCTA';
export { RecommendedSystems } from './RecommendedSystems';
export { SizePricing } from './SizePricing';
export { SocialProof } from './SocialProof';
export { SoleInstaller } from './SoleInstaller';
export { SubsidySection } from './SubsidySection';
export { TopPlaces } from './TopPlaces';
export { WorkThumb } from './WorkThumb';
