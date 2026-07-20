<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Download } from "@lucide/svelte";
  import WidgetShell from "./WidgetShell.svelte";
  import StatTile from "./StatTile.svelte";

  let { data }: { data: any } = $props();

  let layout = $derived(data?.panel_layout ?? {});
  let recommendations = $derived(Array.isArray(data?.recommendations) ? data.recommendations : []);

  let utilizationPercent = $derived.by(() => {
    const n = parseFloat(data?.utilization?.percent);
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), 100) : 0;
  });

  // The SVG is never injected into the page — it is only ever handed to the user
  // as a download, so untrusted markup in it can't execute in our origin.
  function downloadSvg() {
    if (!data?.svg) return;
    const url = URL.createObjectURL(new Blob([data.svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.drawing_id ?? "solar"}_layout.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

{#snippet downloadAction()}
  {#if data.svg}
    <Button variant="outline" size="sm" onclick={downloadSvg}>
      <Download class="w-[1rem] h-[1rem] mr-[theme(--form-element-field-gap)]" />
      Download SVG
    </Button>
  {/if}
{/snippet}

<WidgetShell emoji="🏗️" title="Solar Panel Layout" actions={downloadAction}>
  <div class="flex flex-wrap gap-[theme(--form-element-field-gap)]">
    {#if data.drawing_id}<Badge variant="outline">{data.drawing_id}</Badge>{/if}
    {#if data.status}<Badge variant="outline">{data.status.replace(/_/g, " ")}</Badge>{/if}
  </div>

  <div class="grid grid-cols-2 gap-[theme(--form-element-field-gap)]">
    <StatTile label="System size" value={`${data.system_size_kw} kW`} accent />
    <StatTile label="Total panels" value={layout.total_panels} accent />
    <StatTile label="Layout" value={`${layout.rows} × ${layout.columns}${layout.orientation ? ` (${layout.orientation})` : ""}`} />
    <StatTile label="Roof type" value={data.roof_type} />
  </div>

  {#if data.utilization}
    <div class="flex flex-col gap-[theme(--form-element-field-gap)] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
      <div class="flex justify-between items-center">
        <span class="text-sm font-semibold text-[hsl(var(--foreground))]">Roof utilisation</span>
        <span class="text-base font-bold text-[hsl(var(--primary))]">{data.utilization.percent}%</span>
      </div>
      <p class="text-xs text-[hsl(var(--muted-foreground))]">
        Using {data.utilization.area_used}m² of {data.utilization.area_total}m² available
      </p>
      <div
        class="w-full h-[0.5rem] rounded-[theme(--badge-radius)] bg-[hsl(var(--muted))] overflow-hidden"
        role="progressbar"
        aria-label="Roof utilisation"
        aria-valuenow={utilizationPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div class="h-full bg-[hsl(var(--primary))] transition-all" style="width: {utilizationPercent}%"></div>
      </div>
    </div>
  {/if}

  {#if data.preview_url}
    <img src={data.preview_url} alt="Solar panel layout preview" class="w-full max-w-full rounded-[theme(--radius-md)] border border-[hsl(var(--border))]" />
  {/if}

  {#if recommendations.length}
    <div class="flex flex-col gap-[0.25rem] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
      <p class="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-[theme(--form-element-field-gap)]">
        <span aria-hidden="true">💡</span> Recommendations
      </p>
      <ul class="text-sm text-[hsl(var(--muted-foreground))] list-disc pl-[1.25rem]">
        {#each recommendations as rec}
          <li>{rec}</li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if data.note}
    <p class="text-xs text-[hsl(var(--muted-foreground))]">📝 {data.note}</p>
  {/if}
</WidgetShell>
