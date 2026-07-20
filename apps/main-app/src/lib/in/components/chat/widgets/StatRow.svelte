<script lang="ts">
  // Label-on-the-left / value-on-the-right line, used by the spec and pricing lists.
  let {
    label = "",
    value = "",
    accent = false,
    strong = false,
  }: { label?: string; value?: string | number; accent?: boolean; strong?: boolean } = $props();
</script>

<div class="flex justify-between gap-[theme(--form-element-field-gap)] text-sm">
  <span class="text-[hsl(var(--muted-foreground))]">{label}</span>
  <span class="{strong ? 'font-bold' : 'font-semibold'} text-right {accent ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}">{value}</span>
</div>
