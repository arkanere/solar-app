/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. Five controls, two of them dependent selects, feeding an eligibility verdict that changes as they move. The page around it — the FAQ, the slab table's copy, both JSON-LD blocks — stays server-rendered. */
'use client';

/**
 * The subsidy checker's interactive half. Ported from
 * apps/main-app/src/routes/(layout-1)/tools/subsidy-checker/+page.svelte.
 *
 * It shares the slab table and the cost ladder with the solar calculator;
 * both now come from lib/tools/estimate.ts, where that file explains why two
 * copies of a published money figure was worth removing.
 *
 * `capture('subsidy_checked', …)` is dropped — no PostHog in this app.
 *
 * **One bug fixed in the port.** The state top-up callout reads
 * `{selectedState} State Subsidy`, and the state select starts empty with no
 * requirement to fill it — so anyone who checks a subsidy without choosing a
 * state gets a heading that begins with a space and a sentence reading "Top-up
 * subsidy data for  is coming soon." The block is now conditional on a state
 * having been picked, which is also the only case where it says anything.
 */
import { useState } from 'react';
import { capture } from '@/lib/analytics';
import Link from 'next/link';
import { ArrowRight, CircleCheck, CircleX, Info } from 'lucide-react';
import { BreakdownRow, Panel, ToolLinks } from './Panel';
import { RangeField, SelectField } from './Field';
import type { DistrictOption } from '@/lib/tools/data';
import { geoUrl } from '@/lib/directory/urls';
import { centralSubsidy, grossCost, rupees } from '@/lib/tools/estimate';

const CONNECTION_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'institutional', label: 'Institutional' }
];

const GRID_OPTIONS = [
  { value: 'yes', label: 'Yes (On-Grid)' },
  { value: 'no', label: 'No (Off-Grid)' }
];

export function SubsidyChecker({
  districts,
  totalInstallers
}: {
  districts: DistrictOption[];
  totalInstallers: number;
}) {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [systemSizeKw, setSystemSizeKw] = useState(3);
  const [connectionType, setConnectionType] = useState('residential');
  const [gridConnection, setGridConnection] = useState('yes');
  const [revealed, setRevealed] = useState(false);

  const states = [...new Set(districts.map((d) => d.state))].sort();
  const inState = state ? districts.filter((d) => d.state === state) : [];
  const chosen = districts.find((d) => d.state === state && d.district === district);

  const eligible = connectionType === 'residential' && gridConnection === 'yes';
  const subsidy = centralSubsidy(systemSizeKw, eligible);
  const cost = grossCost(systemSizeKw);

  const check = () => {
    setRevealed(true);
    capture('subsidy_checked', {
      system_size_kw: systemSizeKw,
      eligible,
      subsidy_amount: subsidy,
      net_cost: cost - subsidy,
      state
    });
  };

  /** Both conditions are reported, not just the first — a commercial off-grid
      system fails on two counts and fixing one of them does not help. */
  const reasons = [
    connectionType !== 'residential' && 'Central subsidy is only for residential connections.',
    gridConnection !== 'yes' && 'Central subsidy requires a grid-connected (on-grid) system.'
  ].filter((r): r is string => Boolean(r));

  return (
    <>
      <Panel title="Check Your Subsidy Eligibility">
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <SelectField
            label="State"
            value={state}
            placeholder="Select state"
            options={states.map((s) => ({ value: s, label: s }))}
            onChange={(v) => {
              setState(v);
              setDistrict('');
            }}
          />

          <SelectField
            label="District"
            value={district}
            placeholder="Select district"
            disabled={!state}
            options={inState.map((d) => ({ value: d.district, label: d.district }))}
            onChange={setDistrict}
          />

          <SelectField
            label="Connection Type"
            value={connectionType}
            options={CONNECTION_TYPES}
            onChange={setConnectionType}
          />

          <SelectField
            label="Grid Connection"
            value={gridConnection}
            options={GRID_OPTIONS}
            onChange={setGridConnection}
          />

          <div className="md:col-span-2">
            <RangeField
              label="System Size"
              value={systemSizeKw}
              readout={`${systemSizeKw} kW`}
              min={1}
              max={10}
              step={0.5}
              hint="1 kW – 10 kW"
              onChange={setSystemSizeKw}
            />
          </div>
        </div>

        <button type="button" onClick={check} className="btn btn-primary mt-lg w-full">
          Check Subsidy
        </button>
      </Panel>

      {revealed ? (
        <Panel title="Subsidy Details">
          {/* role="status": the verdict is the answer to the button press, and
              it appears above the fold of the panel rather than where focus
              is, so it has to be announced. */}
          <div
            role="status"
            className={`flex items-start gap-sm rounded-md border p-md ${
              eligible
                ? 'border-success bg-success-surface'
                : 'border-danger bg-danger-surface'
            }`}
          >
            {eligible ? (
              <CircleCheck aria-hidden className="mt-2xs h-5 w-5 shrink-0 text-success" />
            ) : (
              <CircleX aria-hidden className="mt-2xs h-5 w-5 shrink-0 text-danger" />
            )}
            <div>
              <p className="font-semibold text-ink">
                {eligible
                  ? 'Eligible for PM Surya Ghar Subsidy'
                  : 'Not Eligible for Central Subsidy'}
              </p>
              {eligible ? (
                <p className="text-sm text-ink-muted">
                  Your system qualifies for the central government subsidy.
                </p>
              ) : (
                reasons.map((reason) => (
                  <p key={reason} className="text-sm text-ink-muted">
                    {reason}
                  </p>
                ))
              )}
            </div>
          </div>

          <dl className="mt-lg divide-y divide-line border-t border-line pt-xs">
            <BreakdownRow label="System Size" value={`${systemSizeKw} kW`} />
            {/* Full figures, not the abbreviated form the tiles use. The
                SvelteKit page abbreviates past a lakh here too, so it prints
                "Rs 1.6 Lakh" minus "Rs 78,000" leaving "Rs 87,000" — three
                numbers that visibly do not add up. A breakdown's whole job is
                that the reader can check the subtraction. */}
            <BreakdownRow label="Estimated System Cost" value={rupees(cost)} />
            <BreakdownRow
              label="Central Subsidy (PM Surya Ghar)"
              value={subsidy > 0 ? `- ${rupees(subsidy)}` : 'Not applicable'}
              tone={subsidy > 0 ? 'credit' : 'plain'}
            />
            <BreakdownRow
              label="Net Cost (after subsidy)"
              value={rupees(cost - subsidy)}
              tone="total"
            />
          </dl>

          {/* The state top-up. Only shown once a state has been chosen — see
              the file header. `state_subsidies` is empty in every status, so
              "coming soon" is the honest thing to say and there is nothing to
              query. */}
          {state ? (
            <div className="mt-lg flex items-start gap-sm rounded-md bg-surface-sunken p-md">
              <Info aria-hidden className="mt-2xs h-5 w-5 shrink-0 text-action" />
              <div>
                <p className="text-sm font-semibold text-ink">{state} State Subsidy</p>
                <p className="text-sm text-ink-muted">
                  Top-up subsidy data for {state} is coming soon. Some states offer additional
                  subsidies on top of the central PM Surya Ghar scheme.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-lg rounded-md bg-accent-surface p-md">
            {chosen && chosen.installerCount > 0 ? (
              <>
                <p className="text-sm text-ink-muted">
                  Based on our network,{' '}
                  <strong className="font-semibold text-ink">
                    {chosen.installerCount} verified installers
                  </strong>{' '}
                  in <strong className="font-semibold text-ink">{chosen.district}</strong> can
                  install this system.
                </p>
                <a
                  href={geoUrl('in', chosen.stateSlug, chosen.slug)}
                  className="btn btn-primary btn-sm mt-sm"
                >
                  Get Quotes with Subsidy Applied <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </>
            ) : (
              <>
                <p className="text-sm text-ink-muted">
                  Get exact quotes with subsidy applied from{' '}
                  <strong className="font-semibold text-ink">
                    {totalInstallers}+ verified installers
                  </strong>
                  .
                </p>
                <Link href="/in/get-quotes" className="btn btn-primary btn-sm mt-sm">
                  Get Quotes with Subsidy Applied <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          <div className="mt-md">
            <ToolLinks
              links={[
                { label: 'Calculate system size & cost', href: '/tools/solar-calculator' },
                { label: 'Calculate EMI', href: '/tools/emi-calculator' }
              ]}
            />
          </div>
        </Panel>
      ) : null}
    </>
  );
}
