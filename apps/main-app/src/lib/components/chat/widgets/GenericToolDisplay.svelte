<script lang="ts">
  import WidgetShell from "./WidgetShell.svelte";
  import { humanizeToolName } from "../format";

  let { toolName, data }: { toolName: string; data: any } = $props();

  // Fallback for tools that have no bespoke card yet. Guard the stringify so a
  // circular payload can't throw during render.
  let pretty = $derived.by(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  });
</script>

<WidgetShell emoji="🔧" title={humanizeToolName(toolName)}>
  <pre class="text-xs overflow-x-auto p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))]"><code>{pretty}</code></pre>
</WidgetShell>
