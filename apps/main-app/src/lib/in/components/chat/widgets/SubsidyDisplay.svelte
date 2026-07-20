<script lang="ts">
  import WidgetShell from "./WidgetShell.svelte";
  import StatRow from "./StatRow.svelte";
  import { formatCurrency } from "../format";

  let { data }: { data: any } = $props();

  let subsidies = $derived(Array.isArray(data?.subsidies) ? data.subsidies : []);
</script>

<WidgetShell
  emoji="🏛️"
  title="Available Subsidies &amp; Incentives"
  subtitle={data.location ? `in ${data.location}` : ""}
>
  {#each subsidies as subsidy}
    <div class="flex flex-col gap-[theme(--form-element-field-gap)] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
      <div>
        <h5 class="text-sm font-semibold text-[hsl(var(--foreground))]">{subsidy.scheme}</h5>
        {#if subsidy.provider}
          <p class="text-xs text-[hsl(var(--muted-foreground))]">{subsidy.provider}</p>
        {/if}
      </div>
      <StatRow label="Benefit" value={subsidy.subsidy_amount} accent />
      {#if subsidy.total_subsidy}
        <StatRow label="Total" value={formatCurrency(subsidy.total_subsidy)} accent strong />
      {/if}
    </div>
  {/each}
</WidgetShell>
