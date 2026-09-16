/**
 * PM Surya Ghar subsidy. geo-listing.md §5 section 10, gated on
 * `features.subsidy` (IN only).
 *
 * The content is hardcoded, exactly as in the SvelteKit original. Worth
 * knowing why, because the loader looks like it disagrees: the SvelteKit
 * district page selects a `state_subsidies` row and then never passes it to
 * this section, which takes only the place name. That query is dead and is not
 * ported (see lib/directory/data.ts). Nothing here reads the database.
 *
 * Three things changed in the port, all of them rule 1 and rule 2:
 *
 *  - The table head was `bg-primary` with white text — the interaction hue
 *    filling a strip that cannot be interacted with. It is `surface-sunken`
 *    with ink now, which is what the elevation scale is for: things on the
 *    page are separated by a line, not by colour.
 *  - The subsidy column was `text-success`. A subsidy is not a status; it is
 *    the number the reader came for, so it is ink and semibold, and the
 *    status hue goes back to meaning status.
 *  - The "Sample PDF" column is gone. It lazy-loaded jsPDF to generate a
 *    quotation — a separate feature with its own dependency and its own client
 *    boundary, and porting it here would have made a table of five constants
 *    into an interactive leaf. It comes across on its own or not at all.
 *
 * Money is tabular-nums and right-aligned so the four cost columns scan
 * down rather than across, which is the whole reason this is a table.
 */

const ROWS = [
  {
    size: '1 kW',
    gross: '₹65,000 – ₹80,000',
    subsidy: '₹30,000',
    net: '₹35,000 – ₹50,000',
    savings: '~₹7,000'
  },
  {
    size: '2 kW',
    gross: '₹1,30,000 – ₹1,60,000',
    subsidy: '₹60,000',
    net: '₹70,000 – ₹1,00,000',
    savings: '~₹14,000'
  },
  {
    size: '3 kW',
    gross: '₹1,80,000 – ₹2,20,000',
    subsidy: '₹78,000',
    net: '₹1,02,000 – ₹1,42,000',
    savings: '~₹21,000'
  },
  {
    size: '5 kW',
    gross: '₹2,80,000 – ₹3,50,000',
    subsidy: '₹78,000',
    net: '₹2,02,000 – ₹2,72,000',
    savings: '~₹35,000'
  },
  {
    size: '10 kW',
    gross: '₹5,50,000 – ₹7,00,000',
    subsidy: '₹78,000',
    net: '₹4,72,000 – ₹6,22,000',
    savings: '~₹70,000'
  }
];

const HOW_IT_WORKS = [
  'Subsidy is ₹30,000/kW for the first 2 kW',
  'Additional ₹18,000 for capacity between 2–3 kW',
  'Maximum central subsidy is capped at ₹78,000',
  'Subsidy is credited directly to your bank account',
  'Installer must be DISCOM-empanelled to avail subsidy'
];

const STEPS = [
  'Register at pmsuryaghar.gov.in',
  'Get feasibility approval from your DISCOM',
  'Install via a DISCOM-empanelled installer',
  'Submit documents: installation report and net meter application',
  'Subsidy credited within 30 days of inspection'
];

const HEAD = 'px-sm py-xs text-left text-xs font-semibold uppercase tracking-wide text-ink-muted';
const CELL = 'px-sm py-xs text-sm';
const NUM = `${CELL} text-right tabular-nums whitespace-nowrap`;

export function SubsidySection({ place }: { place: string }) {
  return (
    <>
      <h2 className="text-xl">Solar subsidy in {place} — PM Surya Ghar Yojana</h2>
      <p className="mt-sm max-w-prose text-ink-muted">
        The central government&rsquo;s PM Surya Ghar Yojana pays a direct subsidy on residential
        rooftop solar. It is credited to your bank account after installation and grid connection.
      </p>

      {/* The table is wider than a phone and stays a table: five costs that
          have to be compared down a column are not a list. It scrolls
          sideways, with the size column doing the labelling. */}
      <div className="mt-lg overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse">
          <thead>
            <tr className="border-b border-line-strong bg-surface-sunken">
              <th scope="col" className={HEAD}>
                System size
              </th>
              <th scope="col" className={`${HEAD} text-right`}>
                Gross cost
              </th>
              <th scope="col" className={`${HEAD} text-right`}>
                Central subsidy
              </th>
              <th scope="col" className={`${HEAD} text-right`}>
                Net cost
              </th>
              <th scope="col" className={`${HEAD} text-right`}>
                Est. annual savings
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.size} className="border-b border-line last:border-b-0">
                <th scope="row" className={`${CELL} text-left font-semibold`}>
                  {r.size}
                </th>
                <td className={`${NUM} text-ink-muted`}>{r.gross}</td>
                <td className={`${NUM} font-semibold`}>{r.subsidy}</td>
                <td className={`${NUM} font-semibold`}>{r.net}</td>
                <td className={`${NUM} text-ink-muted`}>{r.savings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-lg grid gap-md sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-md">
          <h3 className="text-base">How the subsidy works</h3>
          <ul className="mt-sm list-disc space-y-2xs pl-md text-sm text-ink-muted">
            {HOW_IT_WORKS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-surface p-md">
          <h3 className="text-base">Steps to get the subsidy</h3>
          <ol className="mt-sm list-decimal space-y-2xs pl-md text-sm text-ink-muted">
            {STEPS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      </div>

      <p className="mt-md max-w-prose text-2xs text-ink-subtle">
        Costs are indicative estimates for the {place} region. Final pricing depends on roof type,
        panel brand, inverter and installation complexity. Annual savings assume a ₹7/unit average
        tariff.
      </p>
    </>
  );
}
