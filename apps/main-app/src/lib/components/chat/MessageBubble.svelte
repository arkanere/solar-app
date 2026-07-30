<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Copy, Check, RefreshCw, RotateCcw } from "@lucide/svelte";
  import ToolResultDisplay from "./widgets/ToolResultDisplay.svelte";
  import IntentBadge from "./IntentBadge.svelte";
  import TokenUsage from "./TokenUsage.svelte";
  import { formatTime } from "./format";

  let {
    message,
    renderMessage,
    onRegenerate = null,
    onRetry = null,
    canRegenerate = false,
    children,
  }: {
    message: any;
    renderMessage: any;
    onRegenerate?: any;
    onRetry?: any;
    canRegenerate?: boolean;
    children?: any;
  } = $props();

  let isAssistant = $derived(message.role === "assistant");
  let timeLabel = $derived(formatTime(message.timestamp));

  let copied = $state(false);

  // The bubble renders markdown as HTML, so copy the plain-text source instead of
  // the rendered node — that's what the user actually wants on the clipboard.
  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content ?? "");
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  }
</script>

<div class="flex gap-[theme(--form-element-field-gap)] {isAssistant ? 'justify-start' : 'justify-end'}">
  {#if isAssistant}
    <img
      src="https://api.dicebear.com/9.x/bottts/svg?seed=SolarBot"
      alt=""
      aria-hidden="true"
      class="w-[2rem] h-[2rem] rounded-[theme(--badge-radius)] flex-shrink-0 mt-[theme(--form-element-field-gap)]"
    />
  {/if}

  <div class="flex flex-col max-w-[85%] gap-[0.25rem] group">
    <Card class="{isAssistant ? 'bg-[hsl(var(--card))]' : 'bg-[hsl(var(--primary))]'} border {message.error ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]'}">
      <CardContent class="pt-[theme(--card-padding-y)] text-sm {isAssistant ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--primary-foreground))]'}">
        <div class="break-words [&_ul]:list-disc [&_ul]:pl-[1.25rem] [&_ol]:list-decimal [&_ol]:pl-[1.25rem] [&_li]:my-[0.125rem] [&_h4]:font-semibold [&_p]:my-[0.25rem] [&_a]:underline [&_a]:text-[hsl(var(--primary))] [&_strong]:font-semibold">
          {@html renderMessage(message.content)}
        </div>

        <!-- Failed turn: offer to resend the message that didn't get through -->
        {#if message.error && onRetry}
          <div class="mt-[theme(--card-gap)]">
            <Button onclick={onRetry} variant="outline" size="sm">
              <RotateCcw class="w-[1rem] h-[1rem] mr-[theme(--form-element-field-gap)]" />
              Retry
            </Button>
          </div>
        {/if}

        <!-- Rich tool output (quotation, ROI, CAD, …) -->
        {#if isAssistant && message.toolExecuted}
          <ToolResultDisplay toolExecuted={message.toolExecuted} toolResult={message.toolResult} />
        {/if}

        <!-- Citations -->
        {#if isAssistant && message.sources?.length}
          <div class="mt-[theme(--card-gap)] pt-[theme(--form-element-field-gap)] border-t border-[hsl(var(--border))] flex flex-col gap-[theme(--form-element-field-gap)]">
            <span class="text-xs font-medium text-[hsl(var(--muted-foreground))]">Sources</span>
            {#each message.sources as src}
              <a href={src.url} target="_blank" rel="noopener noreferrer" class="text-xs text-[hsl(var(--primary))] hover:underline break-words">
                {src.title}
              </a>
            {/each}
          </div>
        {/if}

        <!-- There is deliberately no "You might also ask" row here. It used to be fed
             from the `questions` stream event, but those are slot-filling prompts the
             *assistant* asks the customer ("May I have your name?"), so they rendered
             as questions the customer might ask us — directly under the assistant
             asking them. Clicking one echoed the question back as a user turn. The
             backend has no source of genuine follow-ups, so the row is gone rather
             than mislabelled; reinstate it only against a field that actually holds
             suggestions for the customer. -->

        {#if isAssistant && message.intent}
          <IntentBadge intent={message.intent} />
        {/if}

        {#if isAssistant && message.usage}
          <TokenUsage usage={message.usage} />
        {/if}

        <!-- Flow-driven controls (options / inputs / lead form) stay owned by the
             parent so their two-way bindings don't have to cross this boundary. -->
        {@render children?.()}
      </CardContent>
    </Card>

    <!-- Meta row: timestamp + per-message actions -->
    <div class="flex items-center gap-[theme(--form-element-field-gap)] px-[0.25rem] {isAssistant ? '' : 'justify-end'}">
      {#if timeLabel}
        <span class="text-xs text-[hsl(var(--muted-foreground))]">{timeLabel}</span>
      {/if}
      {#if message.stopped}
        <Badge variant="outline">Stopped</Badge>
      {/if}
      {#if isAssistant && !message.error && message.content?.trim()}
        <div class="flex items-center gap-[0.125rem] opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onclick={copyMessage} title={copied ? "Copied!" : "Copy message"} aria-label="Copy message" class="w-[1.75rem] h-[1.75rem] p-0">
            {#if copied}
              <Check class="w-[0.875rem] h-[0.875rem]" />
            {:else}
              <Copy class="w-[0.875rem] h-[0.875rem]" />
            {/if}
          </Button>
          {#if canRegenerate && onRegenerate}
            <Button variant="ghost" size="sm" onclick={onRegenerate} title="Regenerate response" aria-label="Regenerate response" class="w-[1.75rem] h-[1.75rem] p-0">
              <RefreshCw class="w-[0.875rem] h-[0.875rem]" />
            </Button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
