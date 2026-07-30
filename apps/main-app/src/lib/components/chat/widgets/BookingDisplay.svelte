<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import WidgetShell from "./WidgetShell.svelte";
  import StatRow from "./StatRow.svelte";

  let { data, type = "site_visit" }: { data: any; type?: "site_visit" | "lead" } = $props();

  let isSiteVisit = $derived(type === "site_visit");
  let referenceId = $derived(isSiteVisit ? data?.booking_id : data?.lead_id);

  // The payload uses "To be confirmed" as a placeholder rather than omitting the field.
  function isConfirmed(value: unknown): boolean {
    return Boolean(value) && value !== "To be confirmed";
  }
</script>

{#snippet confirmedBadge()}
  <Badge variant="outline">✓ Confirmed</Badge>
{/snippet}

<WidgetShell
  emoji={isSiteVisit ? "📅" : "📝"}
  title={isSiteVisit ? "Site Visit Scheduled" : "Details Received"}
  actions={confirmedBadge}
>
  {#if referenceId}
    <div class="p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
      <p class="text-xs text-[hsl(var(--muted-foreground))]">{isSiteVisit ? "Booking ID" : "Reference ID"}</p>
      <p class="text-base font-mono font-bold text-[hsl(var(--foreground))]">{referenceId}</p>
    </div>
  {/if}

  <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
    <StatRow label="Name" value={data.customer_name} />
    {#if data.phone_number || data.phone}
      <StatRow label="Phone" value={data.phone_number || data.phone} />
    {/if}
    {#if data.location}
      <StatRow label="Location" value={data.location} />
    {/if}
    {#if isSiteVisit && isConfirmed(data.preferred_date)}
      <StatRow label="Date" value={data.preferred_date} />
    {/if}
    {#if isSiteVisit && isConfirmed(data.preferred_time)}
      <StatRow label="Time" value={data.preferred_time} />
    {/if}
  </div>

  <div class="flex flex-col gap-[0.25rem] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
    <p class="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-[theme(--form-element-field-gap)]">
      <span aria-hidden="true">📞</span> Next steps
    </p>
    <ul class="text-sm text-[hsl(var(--muted-foreground))] list-disc pl-[1.25rem]">
      {#if isSiteVisit}
        <li>Our team will contact you within 24 hours</li>
        <li>The site survey will be scheduled at your convenience</li>
      {:else}
        <li>Our team will contact you shortly</li>
        <li>We'll discuss your requirements in detail</li>
        <li>You'll receive a personalised solar solution</li>
      {/if}
    </ul>
  </div>
</WidgetShell>
