import { formatCurrency, formatLakh, formatNumber, formatThousand } from '@/lib/chat/format';
import { Panel, StatRow, StatTile, WidgetShell, type ToolData } from './parts';

export function RoiDisplay({ data }: { data: ToolData }) {
  // The payload carries all 25 years; the first five are shown.
  const milestones: ToolData[] = Array.isArray(data.yearly_breakdown)
    ? data.yearly_breakdown.slice(0, 5)
    : [];
  const annualGeneration = Number(data.monthly_generation_kwh) * 12;

  return (
    <WidgetShell emoji="💰" title="Return on Investment">
      {/* The breakdown only means something when a subsidy applies. */}
      {data.system_cost && data.subsidy > 0 && (
        <Panel>
          <StatRow label="System cost" value={formatCurrency(data.system_cost)} />
          <StatRow label="Government subsidy" value={`- ${formatCurrency(data.subsidy)}`} accent />
          <div className="border-t border-line pt-xs">
            <StatRow label="Net investment" value={formatCurrency(data.investment)} accent strong />
          </div>
        </Panel>
      )}

      <div className="grid grid-cols-2 gap-xs">
        <StatTile label="Net investment" value={formatCurrency(data.investment)} />
        <StatTile label="Monthly savings" value={formatCurrency(data.monthly_savings)} accent />
        <StatTile label="Annual savings" value={formatCurrency(data.annual_savings)} accent />
        <StatTile label="Payback" value={`${data.payback_period_years} yrs`} />
      </div>

      <Panel title="25-year projection">
        <div className="grid grid-cols-2 gap-xs">
          <StatTile label="Total savings" value={formatLakh(data.total_25_year_savings)} accent />
          <StatTile label="ROI" value={`${data.roi_percentage}%`} />
        </div>
        {milestones.length > 0 && (
          <>
            <p className="text-xs font-semibold text-ink-muted">Key milestones</p>
            {milestones.map((year) => (
              <StatRow
                key={year.year}
                label={`Year ${year.year}`}
                value={`${formatLakh(year.cumulative_savings, 2)} (${formatThousand(year.annual_savings)}/yr)`}
              />
            ))}
          </>
        )}
      </Panel>

      <Panel
        title={
          <>
            <span aria-hidden="true">🌱</span> Environmental impact
          </>
        }
      >
        <StatRow label="Annual generation" value={`${formatNumber(annualGeneration)} kWh`} />
        <StatRow
          label="CO₂ offset / year"
          value={`${(Number(data.co2_offset_annually) / 1000).toFixed(1)} tons`}
        />
      </Panel>
    </WidgetShell>
  );
}
