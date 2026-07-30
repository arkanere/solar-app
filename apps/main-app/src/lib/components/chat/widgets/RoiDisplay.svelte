<script lang="ts">
  import WidgetShell from "./WidgetShell.svelte";
  import StatTile from "./StatTile.svelte";
  import StatRow from "./StatRow.svelte";
  import { formatCurrency, formatLakh, formatThousand, formatNumber } from "../format";

  let { data }: { data: any } = $props();

  // Only the first five years are shown; the payload carries all 25.
  let milestones = $derived(Array.isArray(data?.yearly_breakdown) ? data.yearly_breakdown.slice(0, 5) : []);
  let annualGeneration = $derived(Number(data?.monthly_generation_kwh) * 12);
</script>

<WidgetShell emoji="💰" title="Return on Investment">
  <!-- Investment breakdown only makes sense when a subsidy applies -->
  {#if data.system_cost && data.subsidy > 0}
    <div class="flex flex-col gap-[theme(--form-element-field-gap)] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
      <StatRow label="System cost" value={formatCurrency(data.system_cost)} />
      <StatRow label="Government subsidy" value={`- ${formatCurrency(data.subsidy)}`} accent />
      <div class="pt-[theme(--form-element-field-gap)] border-t border-[hsl(var(--border))]">
        <StatRow label="Net investment" value={formatCurrency(data.investment)} accent strong />
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-2 gap-[theme(--form-element-field-gap)]">
    <StatTile label="Net investment" value={formatCurrency(data.investment)} />
    <StatTile label="Monthly savings" value={formatCurrency(data.monthly_savings)} accent />
    <StatTile label="Annual savings" value={formatCurrency(data.annual_savings)} accent />
    <StatTile label="Payback" value={`${data.payback_period_years} yrs`} />
  </div>

  <div class="flex flex-col gap-[theme(--form-element-field-gap)] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
    <h5 class="text-sm font-semibold text-[hsl(var(--foreground))]">25-year projection</h5>
    <div class="grid grid-cols-2 gap-[theme(--form-element-field-gap)]">
      <StatTile label="Total savings" value={formatLakh(data.total_25_year_savings)} accent />
      <StatTile label="ROI" value={`${data.roi_percentage}%`} />
    </div>

    {#if milestones.length}
      <p class="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Key milestones</p>
      {#each milestones as year}
        <StatRow
          label={`Year ${year.year}`}
          value={`${formatLakh(year.cumulative_savings, 2)} (${formatThousand(year.annual_savings)}/yr)`}
        />
      {/each}
    {/if}
  </div>

  <div class="flex flex-col gap-[theme(--form-element-field-gap)] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
    <h5 class="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-[theme(--form-element-field-gap)]">
      <span aria-hidden="true">🌱</span> Environmental impact
    </h5>
    <StatRow label="Annual generation" value={`${formatNumber(annualGeneration)} kWh`} />
    <StatRow label="CO₂ offset / year" value={`${(Number(data.co2_offset_annually) / 1000).toFixed(1)} tons`} />
  </div>
</WidgetShell>
