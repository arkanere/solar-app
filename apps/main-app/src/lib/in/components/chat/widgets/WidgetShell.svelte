<script lang="ts">
  // Common container for every tool-result card: bordered panel, emoji + title header,
  // optional header-right slot (used by the CAD card's download button).
  let {
    emoji = "",
    title = "",
    subtitle = "",
    actions = undefined,
    children,
  }: {
    emoji?: string;
    title?: string;
    subtitle?: string;
    actions?: any;
    children?: any;
  } = $props();
</script>

<div class="mt-[theme(--card-gap)] p-[theme(--card-padding-y)] rounded-[theme(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--background-secondary))] flex flex-col gap-[theme(--card-gap)]">
  <div class="flex items-start justify-between gap-[theme(--form-element-field-gap)]">
    <div class="flex flex-col">
      <h4 class="text-base font-semibold text-[hsl(var(--foreground))] flex items-center gap-[theme(--form-element-field-gap)]">
        {#if emoji}<span aria-hidden="true">{emoji}</span>{/if}
        {title}
      </h4>
      {#if subtitle}
        <span class="text-xs text-[hsl(var(--muted-foreground))]">{subtitle}</span>
      {/if}
    </div>
    {#if actions}{@render actions()}{/if}
  </div>

  {@render children?.()}
</div>
