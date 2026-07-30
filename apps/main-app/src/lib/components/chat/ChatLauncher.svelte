<script lang="ts">
  import { MessageCircle } from "@lucide/svelte";

  // Always-visible entry point to the chat. Rendered by the layout from first
  // paint so visitors who never scroll still discover the assistant; the
  // scroll-depth auto-open remains a separate, additional trigger.
  // `onpreload` fires on hover/focus so the lazy chunk is usually already in
  // flight by the time the click lands.
  //
  // The bottom offset clears the third-party CallSafe widget, which pins itself
  // bottom-right at z-index 999999 on these same layouts — this button stacks
  // directly above it rather than competing for the corner.
  let {
    onopen,
    onpreload = null,
  }: { onopen: () => void; onpreload?: (() => void) | null } = $props();
</script>

<button
  type="button"
  onclick={onopen}
  onpointerenter={() => onpreload?.()}
  onfocus={() => onpreload?.()}
  aria-label="Open Solar Assistant chat"
  class="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-[1.25rem] z-40 flex items-center gap-[0.5rem] rounded-[theme(--badge-radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg p-[0.875rem] sm:px-[1.25rem] sm:py-[0.875rem] transition-transform duration-[var(--duration-fast)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
>
  <MessageCircle class="w-[1.5rem] h-[1.5rem] shrink-0" />
  <span class="hidden sm:inline text-sm font-semibold whitespace-nowrap">Solar Assistant</span>
</button>
