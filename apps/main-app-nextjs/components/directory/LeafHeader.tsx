/**
 * The top of a leaf page. geo-listing.md §5 sections 1 and 3.
 *
 * `PlaceHeader` is the district's; this is its sibling rather than a prop on
 * it, because the two say different things and the district one hardcodes the
 * word "district". Same rules though: a typographic header, not the video hero
 * (§8), and counts stated as facts a reader can check rather than numbers that
 * imply coverage (archetype.md §5).
 *
 * The size variant is careful about what it claims. The page lists the whole
 * district's installers — a 3 kW system is not something an installer is
 * filtered by, and the loader does not pretend it is — so the sub-line says
 * they serve the district, not that they specialise in that size. Saying "12
 * installers fit 3 kW systems" would be the page inventing a fact.
 */
type Props =
  | { kind: 'city'; city: string; level2: string; level1: string; installerCount: number }
  | { kind: 'size'; sizeKw: number; level2: string; level1: string; installerCount: number };

export function LeafHeader(props: Props) {
  const { level2, level1, installerCount } = props;
  const installers =
    installerCount === 1 ? 'One installer' : `${installerCount} installers`;

  if (props.kind === 'city') {
    return (
      <header>
        <h1 className="text-2xl">Solar installers in {props.city}</h1>
        <p className="mt-sm max-w-prose text-ink-muted">
          {installers} {installerCount === 1 ? 'is' : 'are'} based in {props.city}, part of{' '}
          {level2} district, {level1}.
        </p>
      </header>
    );
  }

  return (
    <header>
      <h1 className="text-2xl">
        {props.sizeKw} kW solar systems in {level2}
      </h1>
      <p className="mt-sm max-w-prose text-ink-muted">
        {installers} {installerCount === 1 ? 'serves' : 'serve'} {level2} district, {level1}, and
        can quote for a {props.sizeKw} kW rooftop system.
      </p>
    </header>
  );
}
