import { formatCurrency } from '@/lib/chat/format';
import { Panel, StatRow, WidgetShell, type ToolData } from './parts';

export function SubsidyDisplay({ data }: { data: ToolData }) {
  const subsidies: ToolData[] = Array.isArray(data.subsidies) ? data.subsidies : [];
  return (
    <WidgetShell
      emoji="🏛️"
      title="Available Subsidies & Incentives"
      subtitle={data.location ? `in ${data.location}` : undefined}
    >
      {subsidies.map((subsidy, i) => (
        <Panel key={i}>
          <div>
            <h5 className="text-sm font-semibold">{subsidy.scheme}</h5>
            {subsidy.provider && <p className="text-xs text-ink-muted">{subsidy.provider}</p>}
          </div>
          <StatRow label="Benefit" value={subsidy.subsidy_amount} accent />
          {subsidy.total_subsidy && (
            <StatRow label="Total" value={formatCurrency(subsidy.total_subsidy)} accent strong />
          )}
        </Panel>
      ))}
    </WidgetShell>
  );
}
