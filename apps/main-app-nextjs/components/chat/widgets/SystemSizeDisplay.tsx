import { StatRow, StatTile, WidgetShell, type ToolData } from './parts';

export function SystemSizeDisplay({ data }: { data: ToolData }) {
  return (
    <WidgetShell emoji="📐" title="System Size Recommendation">
      <div className="grid grid-cols-2 gap-xs">
        <StatTile label="Recommended size" value={`${data.recommended_system_size_kw} kW`} accent />
        <StatTile label="Number of panels" value={data.number_of_panels} accent />
      </div>
      <div className="flex flex-col gap-xs">
        <StatRow label="Monthly consumption" value={`${data.monthly_consumption_kwh} kWh`} />
        <StatRow label="Panel type" value={data.panel_wattage} />
        <StatRow label="Required roof area" value={`${data.required_roof_area_sqft} sq ft`} />
        <StatRow label="Est. generation" value={`${data.estimated_monthly_generation} kWh/month`} />
        <StatRow
          label="Coverage"
          value={`${data.estimated_coverage_percent}% of your usage`}
          accent
        />
      </div>
      {data.coverage_basis && <p className="text-xs text-ink-muted">{data.coverage_basis}</p>}
    </WidgetShell>
  );
}
