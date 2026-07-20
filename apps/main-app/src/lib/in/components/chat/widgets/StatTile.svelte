<script lang="ts">
  // Small labelled figure used across the ROI / system-size / CAD cards.
  let {
    label = "",
    value = "",
    accent = false,
  }: { label?: string; value?: string | number; accent?: boolean } = $props();
</script>

<div class="p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
  <p class="text-xs text-[hsl(var(--muted-foreground))] mb-[0.125rem]">{label}</p>
  <p class="text-lg font-bold {accent ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}">{value}</p>
</div>
