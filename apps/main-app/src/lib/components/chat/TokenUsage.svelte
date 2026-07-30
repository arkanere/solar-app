<script lang="ts">
  import { formatNumber } from "./format";

  let { usage }: { usage: any } = $props();

  let cost = $derived(Number(usage?.costINR));
</script>

<div class="mt-[theme(--form-element-field-gap)] flex flex-wrap gap-x-[theme(--card-gap)] gap-y-[0.125rem] text-xs text-[hsl(var(--muted-foreground))]">
  <span>In {formatNumber(usage.input)}</span>
  <span>Out {formatNumber(usage.output)}</span>
  <span>Total {formatNumber(usage.total)}</span>
  {#if Number.isFinite(cost)}
    <span>₹{cost.toFixed(4)}</span>
  {/if}
</div>
