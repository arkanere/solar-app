/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. Five controls feeding one chain of arithmetic, and two of them are dependent selects — picking a state rewrites the district list. All of it is state reacting to input. The page around it, including the FAQ and both JSON-LD blocks, stays server-rendered. */
'use client';

/**
 * The solar calculator's interactive half. Ported from
 * apps/main-app/src/routes/(layout-1)/tools/solar-calculator/+page.svelte.
 *
 * The estimate chain — bill to units to system size to cost to payback —
 * comes across unchanged, with the two formulae it shares with the subsidy
 * checker now in lib/tools/estimate.ts rather than written out twice.
 *
 * Three things are not carried across:
 *
 *  - **`capture('solar_calculator_used', …)`.** There is no PostHog in this
 *    app.
 *  - **the `state_subsidies` read.** Its loader selects every published state
 *    subsidy row, and the page never reads `data.subsidies` — a dead query,
 *    the same kind lib/directory/data.ts declines to port. The table is empty
 *    in every status anyway (README), so even wiring it up would render
 *    nothing.
 *  - **the state top-up in the estimate.** It was never in it: the subsidy
 *    line is central-only, which is why the page's own FAQ says "state
 *    subsidies where data is available" and then shows none.
 *
 * `districts` arrives as the whole IN tree — around 700 rows. It is passed
 * whole because the state list is derived from it and the district list has
 * to re-derive on every state change; splitting it into a lookup keyed by
 * state would be the same bytes over the wire in a shape only this file uses.
 */
import { useState } from 'react';
import { capture } from '@/lib/analytics';
import Link from 'next/link';
import { ArrowRight, Clock, IndianRupee, Sun, Zap } from 'lucide-react';
import { BreakdownRow, Panel, StatTile, ToolLinks } from './Panel';
import { RangeField, SelectField } from './Field';
import type { DistrictOption } from '@/lib/tools/data';
import { geoUrl } from '@/lib/directory/urls';
import {
  PEAK_SUN_HOURS,
  centralSubsidy,
  grossCost,
  rupees,
  rupeesShort
} from '@/lib/tools/estimate';

const SYSTEM_TYPES = [
  { value: 'on-grid', label: 'On-Grid (with subsidy)' },
  { value: 'off-grid', label: 'Off-Grid' },
  { value: 'hybrid', label: 'Hybrid' }
];

export function SolarCalculator({
  districts,
  totalInstallers
}: {
  districts: DistrictOption[];
  totalInstallers: number;
}) {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [monthlyBill, setMonthlyBill] = useState(2_000);
  const [ratePerUnit, setRatePerUnit] = useState(8);
  const [systemType, setSystemType] = useState('on-grid');
  const [revealed, setRevealed] = useState(false);

  const states = [...new Set(districts.map((d) => d.state))].sort();
  const inState = state ? districts.filter((d) => d.state === state) : [];
  const chosen = districts.find((d) => d.state === state && d.district === district);

  const monthlyUnits = Math.round(monthlyBill / ratePerUnit);
  /**
   * Units per day over peak sun hours is the system size. The floor of 1 kW
   * is the original's and stays: below that the market does not sell a
   * rooftop system, so an estimate for 0.4 kW would be a number no installer
   * can quote against.
   */
  const systemSizeKw = Number(Math.max(1, monthlyUnits / 30 / PEAK_SUN_HOURS).toFixed(1));

  const gross = grossCost(systemSizeKw);
  const subsidy = centralSubsidy(systemSizeKw, systemType === 'on-grid');
  const netCost = gross - subsidy;

  const annualGeneration = Math.round(systemSizeKw * PEAK_SUN_HOURS * 365);
  const annualSavings = Math.round(annualGeneration * ratePerUnit);
  const paybackYears = annualSavings > 0 ? Number((netCost / annualSavings).toFixed(1)) : 0;
  const savings25Years = Math.round(annualSavings * 25 - netCost);

  const calculate = () => {
    setRevealed(true);
    capture('solar_calculator_used', {
      monthly_bill: monthlyBill,
      system_size_kw: systemSizeKw,
      net_cost: netCost,
      payback_years: paybackYears,
      state,
      district
    });
  };

  return (
    <>
      <Panel>
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <SelectField
            label="State"
            value={state}
            placeholder="Select state"
            options={states.map((s) => ({ value: s, label: s }))}
            onChange={(v) => {
              setState(v);
              // The chosen district almost certainly does not exist in the new
              // state, and a stale one would silently point the CTA at the
              // wrong place.
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
            label="System Type"
            value={systemType}
            options={SYSTEM_TYPES}
            onChange={setSystemType}
          />

          <RangeField
            label="Monthly Electricity Bill"
            value={monthlyBill}
            readout={rupees(monthlyBill)}
            min={500}
            max={15_000}
            step={100}
            hint="Rs 500 - Rs 15,000"
            onChange={setMonthlyBill}
          />

          <RangeField
            label="Electricity Rate (Rs/unit)"
            value={ratePerUnit}
            readout={`Rs ${ratePerUnit.toFixed(1)}`}
            min={3}
            max={15}
            step={0.5}
            hint="Rs 3 - Rs 15 per unit"
            onChange={setRatePerUnit}
          />
        </div>

        <button type="button" onClick={calculate} className="btn btn-primary mt-lg w-full">
          Calculate
        </button>
      </Panel>

      {revealed ? (
        <Panel title="Your Solar Estimate">
          <div className="grid grid-cols-2 gap-md md:grid-cols-4">
            <StatTile icon={Sun} value={`${systemSizeKw} kW`} label="System Size" />
            <StatTile
              icon={IndianRupee}
              value={rupeesShort(netCost)}
              label="Net Cost (after subsidy)"
            />
            <StatTile icon={Zap} value={rupeesShort(annualSavings)} label="Annual Savings" />
            <StatTile icon={Clock} value={`${paybackYears} yrs`} label="Payback Period" />
          </div>

          <h3 className="mt-lg text-lg text-ink">Cost Breakdown</h3>
          <dl className="mt-xs divide-y divide-line border-t border-line pt-xs">
            <BreakdownRow label="Gross System Cost" value={rupees(gross)} />
            {subsidy > 0 ? (
              <BreakdownRow
                label="Central Subsidy (PM Surya Ghar)"
                value={`- ${rupees(subsidy)}`}
                tone="credit"
              />
            ) : null}
            <BreakdownRow label="Net Cost" value={rupees(netCost)} tone="total" />
          </dl>

          <h3 className="mt-lg text-lg text-ink">Generation &amp; Savings</h3>
          <dl className="mt-xs divide-y divide-line border-t border-line pt-xs">
            <BreakdownRow label="Monthly Consumption" value={`${monthlyUnits} units`} />
            <BreakdownRow
              label="Annual Generation"
              value={`${annualGeneration.toLocaleString('en-IN')} units`}
            />
            {/* Full figure, as every breakdown row is — the tiles are the
                only place the abbreviated form belongs. */}
            <BreakdownRow label="25-Year Net Savings" value={rupees(savings25Years)} tone="credit" />
          </dl>

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
                  Get Exact Quotes <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </>
            ) : (
              <>
                <p className="text-sm text-ink-muted">
                  Get exact quotes from{' '}
                  <strong className="font-semibold text-ink">
                    {totalInstallers}+ verified installers
                  </strong>{' '}
                  across India.
                </p>
                <Link href="/in/get-quotes" className="btn btn-primary btn-sm mt-sm">
                  Get Free Quotes <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          <div className="mt-md">
            <ToolLinks
              links={[
                { label: 'Calculate EMI for this system', href: '/tools/emi-calculator' },
                { label: 'Check detailed subsidy', href: '/tools/subsidy-checker' }
              ]}
            />
          </div>
        </Panel>
      ) : null}
    </>
  );
}
