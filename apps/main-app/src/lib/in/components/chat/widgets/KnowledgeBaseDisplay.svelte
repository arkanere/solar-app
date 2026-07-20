<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import WidgetShell from "./WidgetShell.svelte";

  let { data }: { data: any } = $props();

  let related = $derived(Array.isArray(data?.related) ? data.related : []);
</script>

<WidgetShell emoji="📚" title={data.title}>
  <!-- Knowledge-base content is plain text, not markdown — render as text, not @html. -->
  <p class="text-sm text-[hsl(var(--foreground))] break-words whitespace-pre-line">{data.content}</p>

  {#if related.length}
    <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <p class="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Related topics</p>
      <div class="flex flex-wrap gap-[theme(--form-element-field-gap)]">
        {#each related as topic}
          <Badge variant="outline">{topic}</Badge>
        {/each}
      </div>
    </div>
  {/if}
</WidgetShell>
