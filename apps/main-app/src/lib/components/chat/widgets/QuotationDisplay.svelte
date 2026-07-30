<script lang="ts">
  import WidgetShell from "./WidgetShell.svelte";
  import StatRow from "./StatRow.svelte";
  import StatTile from "./StatTile.svelte";
  import { formatCurrency } from "../format";

  let { data }: { data: any } = $props();

  let system = $derived(data?.system_details ?? {});
  let pricing = $derived(data?.pricing ?? {});
</script>

<WidgetShell emoji="📋" title="Solar Quotation" subtitle={data.quotation_number}>
  <div class="grid grid-cols-2 gap-[theme(--form-element-field-gap)] text-sm">
    <div>
      <p class="text-xs text-[hsl(var(--muted-foreground))]">Customer</p>
      <p class="font-semibold text-[hsl(var(--foreground))]">{data.customer_name}</p>
    </div>
    <div>
      <p class="text-xs text-[hsl(var(--muted-foreground))]">Location</p>
      <p class="font-semibold text-[hsl(var(--foreground))]">{data.location}</p>
    </div>
    {#if data.date}
      <div>
        <p class="text-xs text-[hsl(var(--muted-foreground))]">Date</p>
        <p class="font-semibold text-[hsl(var(--foreground))]">{data.date}</p>
      </div>
    {/if}
  </div>

  <div class="flex flex-col gap-[theme(--form-element-field-gap)] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
    <h5 class="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-[theme(--form-element-field-gap)]">
      <span aria-hidden="true">⚡</span> System specifications
    </h5>
    <StatRow label="Capacity" value={system.capacity} />
    <StatRow label="Panels" value={`${system.number_of_panels} × ${system.panel_wattage}`} />
    <StatRow label="Type" value={system.panel_type} />
    <StatRow label="Generation" value={system.estimated_generation} />
  </div>

  <div class="flex flex-col gap-[theme(--form-element-field-gap)] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
    <h5 class="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-[theme(--form-element-field-gap)]">
      <span aria-hidden="true">💰</span> Pricing breakdown
    </h5>
    <StatRow label="System cost" value={formatCurrency(pricing.system_cost)} />
    {#if pricing.subsidy > 0}
      <StatRow label="Government subsidy" value={`- ${formatCurrency(pricing.subsidy)}`} accent />
    {/if}
    <div class="pt-[theme(--form-element-field-gap)] border-t border-[hsl(var(--border))]">
      <StatRow label="Final cost" value={formatCurrency(pricing.final_cost)} accent strong />
    </div>
  </div>

  {#if data.savings}
    <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <h5 class="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-[theme(--form-element-field-gap)]">
        <span aria-hidden="true">📈</span> Estimated savings
      </h5>
      <div class="grid grid-cols-2 gap-[theme(--form-element-field-gap)]">
        <StatTile label="Monthly" value={formatCurrency(data.savings.estimated_monthly_savings)} accent />
        <StatTile label="Annual" value={formatCurrency(data.savings.annual_savings)} accent />
      </div>
      <StatRow label="Payback period" value={data.savings.payback_period} />
    </div>
  {/if}

  {#if data.validity}
    <p class="text-xs text-[hsl(var(--muted-foreground))] text-center pt-[theme(--form-element-field-gap)] border-t border-[hsl(var(--border))]">
      Valid for {data.validity} • Includes installation &amp; commissioning
    </p>
  {/if}
</WidgetShell>
