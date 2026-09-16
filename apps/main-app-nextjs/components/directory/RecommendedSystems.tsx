/**
 * "What size do I need?" — geo-listing.md §5 section 13, gated on
 * `features.seoContentFamilies` (IN only).
 *
 * A sizing table, not a product list: the reader knows their monthly bill and
 * whether the power goes out, and those two facts pick the system. So the two
 * inputs are the first two columns and the answer is the third, which is the
 * order the reader already has the information in.
 *
 * The "Sample PDF" column is dropped for the same reason as in
 * SubsidySection — it lazy-loaded jsPDF, and it would turn a table of six
 * constants into a client leaf.
 *
 * Content ported from apps/main-app/src/lib/constants/solarSystems.ts. The
 * note that the old card parenthesised under each system is a caption line
 * instead; parentheses inside a table cell read as an aside about the cell,
 * which is exactly what it is not — "battery 3–6 kWh" is part of the
 * recommendation.
 */

const ROWS = [
  {
    consumption: '100 – 200 units / ₹500 – ₹1,500',
    outage: 'No outage',
    system: '1 – 2 kW on-grid',
    note: 'No battery required; net metering'
  },
  {
    consumption: '100 – 200 units / ₹500 – ₹1,500',
    outage: 'Over 1 hour',
    system: '1.5 – 2.5 kW hybrid',
    note: 'Battery 1–3 kWh for critical loads'
  },
  {
    consumption: '200 – 400 units / ₹1,500 – ₹3,000',
    outage: 'No outage',
    system: '2 – 3 kW on-grid',
    note: ''
  },
  {
    consumption: '200 – 400 units / ₹1,500 – ₹3,000',
    outage: 'Over 1 hour',
    system: '3 – 4 kW hybrid',
    note: 'Battery 3–6 kWh'
  },
  {
    consumption: '400 – 600 units / ₹3,000 – ₹5,000',
    outage: 'No outage',
    system: '3 – 5 kW on-grid',
    note: ''
  },
  {
    consumption: '400 – 600 units / ₹3,000 – ₹5,000',
    outage: 'Over 1 hour',
    system: '4 – 6 kW hybrid',
    note: 'Battery 6–10 kWh'
  }
];

const HEAD = 'px-sm py-xs text-left text-xs font-semibold uppercase tracking-wide text-ink-muted';
const CELL = 'px-sm py-xs text-sm';

export function RecommendedSystems() {
  return (
    <>
      <h2 className="text-xl">Recommended system sizes for homes</h2>
      <p className="mt-sm max-w-prose text-ink-muted">
        Your monthly bill and how often the power goes out are the two things that pick a system
        size. Use this as a starting point, then ask an installer to size it against your roof.
      </p>

      <div className="mt-lg overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <thead>
            <tr className="border-b border-line-strong bg-surface-sunken">
              <th scope="col" className={HEAD}>
                Monthly consumption / bill
              </th>
              <th scope="col" className={HEAD}>
                Power outage
              </th>
              <th scope="col" className={HEAD}>
                Recommended system
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                key={`${r.consumption}-${r.outage}`}
                className="border-b border-line last:border-b-0"
              >
                <th scope="row" className={`${CELL} whitespace-nowrap text-left font-normal text-ink-muted`}>
                  {r.consumption}
                </th>
                <td className={`${CELL} whitespace-nowrap text-ink-muted`}>{r.outage}</td>
                <td className={CELL}>
                  <span className="font-semibold">{r.system}</span>
                  {r.note ? (
                    <span className="mt-2xs block text-xs text-ink-subtle">{r.note}</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
