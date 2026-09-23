import { formatCurrency } from '@/lib/chat/format';
import { Panel, StatRow, StatTile, WidgetShell, type ToolData } from './parts';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

export function QuotationDisplay({ data }: { data: ToolData }) {
  const system: ToolData = data.system_details ?? {};
  const pricing: ToolData = data.pricing ?? {};
  return (
    <WidgetShell emoji="📋" title="Solar Quotation" subtitle={data.quotation_number}>
      <div className="grid grid-cols-2 gap-xs text-sm">
        <Field label="Customer" value={data.customer_name} />
        <Field label="Location" value={data.location} />
        {data.date && <Field label="Date" value={data.date} />}
      </div>

      <Panel
        title={
          <>
            <span aria-hidden="true">⚡</span> System specifications
          </>
        }
      >
        <StatRow label="Capacity" value={system.capacity} />
        <StatRow label="Panels" value={`${system.number_of_panels} × ${system.panel_wattage}`} />
        <StatRow label="Type" value={system.panel_type} />
        <StatRow label="Generation" value={system.estimated_generation} />
      </Panel>

      <Panel
        title={
          <>
            <span aria-hidden="true">💰</span> Pricing breakdown
          </>
        }
      >
        <StatRow label="System cost" value={formatCurrency(pricing.system_cost)} />
        {pricing.subsidy > 0 && (
          <StatRow
            label="Government subsidy"
            value={`- ${formatCurrency(pricing.subsidy)}`}
            accent
          />
        )}
        <div className="border-t border-line pt-xs">
          <StatRow label="Final cost" value={formatCurrency(pricing.final_cost)} accent strong />
        </div>
      </Panel>

      {data.savings && (
        <div className="flex flex-col gap-xs">
          <h5 className="flex items-center gap-xs text-sm font-semibold">
            <span aria-hidden="true">📈</span> Estimated savings
          </h5>
          <div className="grid grid-cols-2 gap-xs">
            <StatTile
              label="Monthly"
              value={formatCurrency(data.savings.estimated_monthly_savings)}
              accent
            />
            <StatTile label="Annual" value={formatCurrency(data.savings.annual_savings)} accent />
          </div>
          <StatRow label="Payback period" value={data.savings.payback_period} />
        </div>
      )}

      {data.validity && (
        <p className="border-t border-line pt-xs text-center text-xs text-ink-muted">
          Valid for {data.validity} • Includes installation &amp; commissioning
        </p>
      )}
    </WidgetShell>
  );
}
