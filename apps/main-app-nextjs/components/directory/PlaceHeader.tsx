/**
 * The top of a geo listing page.
 *
 * DECIDED: this replaces the video hero. It sat on all 601 geo pages plus the
 * leaf variants, carried no information, and was the largest asset on the two
 * highest-traffic page types — design-foundation.md §9 deferred imagery policy
 * to exactly this slice, and this is the answer for the hero specifically: the
 * page's job is to say what is here, and type says it faster than video.
 *
 * The counts are stated as ratios, not bare numbers (archetype.md §5): "3 of
 * 47 cities" is a claim a reader can check, where "47 cities" implies coverage
 * the directory does not have. The cities line is omitted rather than shown as
 * "0 of 47" — a page with no city pages under it has nothing to say here.
 */

export function PlaceHeader({
  level2,
  level1,
  installerCount,
  citiesCovered,
  citiesTotal
}: {
  level2: string;
  level1: string;
  installerCount: number;
  citiesCovered: number;
  citiesTotal: number;
}) {
  return (
    <header>
      <h1 className="text-2xl">Solar installers in {level2}</h1>
      <p className="mt-sm max-w-prose text-ink-muted">
        {installerCount === 1
          ? `One installer serves ${level2} district, ${level1}.`
          : `${installerCount} installers serve ${level2} district, ${level1}.`}
        {citiesCovered > 0
          ? ` Listings cover ${citiesCovered} of ${citiesTotal} cities in the district.`
          : ''}
      </p>
    </header>
  );
}
