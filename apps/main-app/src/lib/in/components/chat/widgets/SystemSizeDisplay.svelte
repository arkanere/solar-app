<script lang="ts">
  import WidgetShell from "./WidgetShell.svelte";
  import StatTile from "./StatTile.svelte";
  import StatRow from "./StatRow.svelte";

  let { data }: { data: any } = $props();
</script>

<WidgetShell emoji="📐" title="System Size Recommendation">
  <div class="grid grid-cols-2 gap-[theme(--form-element-field-gap)]">
    <StatTile label="Recommended size" value={`${data.recommended_system_size_kw} kW`} accent />
    <StatTile label="Number of panels" value={data.number_of_panels} accent />
  </div>

  <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
    <StatRow label="Monthly consumption" value={`${data.monthly_consumption_kwh} kWh`} />
    <StatRow label="Panel type" value={data.panel_wattage} />
    <StatRow label="Required roof area" value={`${data.required_roof_area_sqft} sq ft`} />
    <StatRow label="Est. generation" value={`${data.estimated_monthly_generation} kWh/month`} />
    <StatRow label="Coverage" value={data.estimated_coverage} accent />
  </div>
</WidgetShell>
