/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. Three controls whose every movement re-runs the EMI formula and the whole bank comparison; the numbers only exist in response to dragging, which is the one thing a server component cannot do. The page around it stays server-rendered. */
'use client';

/**
 * The EMI calculator's interactive half. Ported from
 * apps/main-app/src/routes/(layout-1)/tools/emi-calculator/+page.svelte.
 *
 * Svelte's `$derived` becomes plain expressions in the render body. There is
 * no `useMemo` on any of them on purpose: each is one `Math.pow` or a map
 * over a list that is empty today and would be a dozen rows at most. Memoising
 * arithmetic that is cheaper than the memo's own bookkeeping makes the code
 * harder to read and the page no faster.
 *
 * The results stay behind the button, exactly as the original: `revealed` is
 * only ever set true, so once the reader has asked for the numbers the panel
 * tracks the sliders live. A button that gates the first reveal and then gets
 * out of the way is the behaviour the SvelteKit page has, and it is the right
 * one — a reader who has not entered anything yet should not be shown an EMI
 * for the default loan.
 *
 * `capture('...')` is dropped: there is no PostHog in this app.
 */
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, IndianRupee, Percent } from 'lucide-react';
import { BreakdownRow, Panel, StatTile } from './Panel';
import { RangeField, SelectField } from './Field';
import { contentUrl } from '@/lib/directory/urls';
import type { FinancingBank } from '@/lib/tools/data';
import { emi, rupees } from '@/lib/tools/estimate';

const TENURES = [12, 24, 36, 48, 60];

export function EmiCalculator({ banks }: { banks: FinancingBank[] }) {
  const [loanAmount, setLoanAmount] = useState(300_000);
  const [tenure, setTenure] = useState(60);
  const [interestRate, setInterestRate] = useState(9);
  const [revealed, setRevealed] = useState(false);

  const monthly = Math.round(emi(loanAmount, interestRate, tenure));
  const totalPayment = monthly * tenure;
  const totalInterest = totalPayment - loanAmount;

  /**
   * A bank row whose `interest_rate` does not parse falls back to the
   * slider's rate rather than being dropped. The column is free-form `text`,
   * so a row reading "9.5% onwards" is a real possibility; showing the bank
   * with the reader's own rate is more useful than hiding it, and the rate
   * column prints what was used either way.
   */
  const comparisons = banks.map((bank) => {
    const rate = Number.parseFloat(bank.interestRate ?? '') || interestRate;
    const bankEmi = Math.round(emi(loanAmount, rate, tenure));
    return {
      ...bank,
      rate,
      emi: bankEmi,
      totalInterest: bankEmi * tenure - loanAmount
    };
  });

  return (
    <>
      <Panel>
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <div className="md:col-span-2">
            <RangeField
              label="Loan Amount"
              value={loanAmount}
              readout={rupees(loanAmount)}
              min={50_000}
              max={2_000_000}
              step={10_000}
              hint="Rs 50,000 - Rs 20,00,000"
              onChange={setLoanAmount}
            />
          </div>

          <RangeField
            label="Interest Rate (% p.a.)"
            value={interestRate}
            readout={`${interestRate.toFixed(1)}%`}
            min={5}
            max={18}
            step={0.25}
            hint="5% - 18%"
            onChange={setInterestRate}
          />

          <SelectField
            label="Loan Tenure"
            value={String(tenure)}
            onChange={(v) => setTenure(Number(v))}
            options={TENURES.map((months) => ({
              value: String(months),
              label: `${months} months (${months / 12} ${months === 12 ? 'year' : 'years'})`
            }))}
          />
        </div>

        <button type="button" onClick={() => setRevealed(true)} className="btn btn-primary mt-lg w-full">
          Calculate EMI
        </button>
      </Panel>

      {revealed ? (
        <>
          <Panel title="EMI Breakdown">
            <div className="grid grid-cols-1 gap-md md:grid-cols-3">
              <StatTile icon={IndianRupee} value={rupees(monthly)} label="Monthly EMI" />
              <StatTile icon={Percent} value={rupees(totalInterest)} label="Total Interest" />
              <StatTile icon={Calendar} value={rupees(totalPayment)} label="Total Payment" />
            </div>

            <dl className="mt-lg divide-y divide-line border-t border-line pt-xs">
              <BreakdownRow label="Loan Amount" value={rupees(loanAmount)} />
              <BreakdownRow label="Interest Rate" value={`${interestRate.toFixed(2)}% p.a.`} />
              <BreakdownRow label="Tenure" value={`${tenure} months`} />
              <BreakdownRow
                label="Principal Component"
                value={`${Math.round((loanAmount / totalPayment) * 100)}% of total`}
              />
              <BreakdownRow
                label="Interest Component"
                value={`${Math.round((totalInterest / totalPayment) * 100)}% of total`}
              />
            </dl>
          </Panel>

          {/* `solar_financing_banks` is empty today, so this never renders.
              It is built rather than deferred because the table is the only
              reason the page queries anything — lib/tools/data.ts. */}
          {comparisons.length > 0 ? (
            <Panel title="Compare Bank Schemes">
              <p className="text-sm text-ink-muted">
                EMI comparison for {rupees(loanAmount)} over {tenure} months.
              </p>
              <div className="mt-md overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-ink-muted">
                      <th scope="col" className="py-xs pr-md font-medium">
                        Bank
                      </th>
                      <th scope="col" className="px-md py-xs text-right font-medium">
                        Rate
                      </th>
                      <th scope="col" className="px-md py-xs text-right font-medium">
                        Monthly EMI
                      </th>
                      <th scope="col" className="py-xs pl-md text-right font-medium">
                        Total Interest
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((bank) => (
                      <tr key={bank.slug} className="border-b border-line last:border-0">
                        <th scope="row" className="py-sm pr-md text-left font-medium">
                          <a href={contentUrl(`/solar-financing/${bank.slug}`)}>{bank.name}</a>
                        </th>
                        <td className="px-md py-sm text-right tabular-nums">
                          {bank.rate.toFixed(2)}%
                        </td>
                        <td className="px-md py-sm text-right font-medium tabular-nums">
                          {rupees(bank.emi)}
                        </td>
                        <td className="py-sm pl-md text-right tabular-nums">
                          {rupees(bank.totalInterest)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ) : null}

          <div className="rounded-lg bg-accent-surface p-md">
            <p className="text-sm text-ink-muted">
              Ready to finance your solar installation? Get connected with verified installers who
              can help with financing options.
            </p>
            <Link href="/in/get-quotes" className="btn btn-primary mt-sm">
              Apply for Solar Financing <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </>
      ) : null}
    </>
  );
}
