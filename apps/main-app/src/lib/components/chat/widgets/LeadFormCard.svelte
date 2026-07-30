<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Badge } from "$lib/components/ui/badge";
  import { validateLeadForm, type LeadFormErrors } from "$lib/constants/formValidation";
  import WidgetShell from "./WidgetShell.svelte";
  import StatRow from "./StatRow.svelte";

  // `data` is the offer_lead_form tool result: title, description and a prefill
  // map built from whatever the conversation already established. The agent
  // cannot write leads itself — submitting here is the only path to the leads
  // table, same endpoint the standalone LeadForm components use.
  let { data }: { data: any } = $props();

  const CONSULTATION_TYPES = [
    "Residential - Independent Home",
    "Residential - Apartments/Housing societies",
    "Business/Commercial"
  ];

  const prefill = data?.prefill ?? {};

  let name = $state(prefill.name ?? "");
  let phone = $state(prefill.phone ?? "");
  let pinCode = $state(prefill.pinCode ?? "");
  let email = $state(prefill.email ?? "");
  let type = $state(CONSULTATION_TYPES.includes(prefill.type) ? prefill.type : "");
  let comment = $state(prefill.comment ?? "");

  let isSubmitting = $state(false);
  let submitted = $state(false);
  let referenceId = $state<string | null>(null);
  let submitError = $state("");
  let errors = $state<Partial<LeadFormErrors>>({});

  // Which fields arrived already filled, so the user can see what is left of them.
  let prefilledKeys = $derived(Object.keys(prefill).filter((k) => prefill[k]));

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const { isValid, errors: newErrors } = validateLeadForm(name, phone, pinCode, email, type, comment);
    errors = newErrors;
    if (!isValid) return;

    isSubmitting = true;
    submitError = "";
    try {
      const res = await fetch("/in/api/submitLead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          pinCode,
          type,
          comment,
          email,
          urlParam: "/chatbot"
        })
      });
      const body = await res.json();
      if (!res.ok || !body?.success) throw new Error(body?.error ?? "Failed to submit");
      referenceId = body.id ?? null;
      submitted = true;
    } catch (err) {
      console.error("Chat lead submission failed:", err);
      // Never claim success we did not get — the whole point of routing through
      // this form is that the confirmation is real.
      submitError = "We could not submit that just now. Please try again in a moment.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if submitted}
  {#snippet confirmedBadge()}
    <Badge variant="outline">✓ Submitted</Badge>
  {/snippet}

  <WidgetShell emoji="✅" title="Request Submitted" actions={confirmedBadge}>
    {#if referenceId}
      <div class="p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
        <p class="text-xs text-[hsl(var(--muted-foreground))]">Reference ID</p>
        <p class="text-base font-mono font-bold text-[hsl(var(--foreground))]">{referenceId}</p>
      </div>
    {/if}

    <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <StatRow label="Name" value={name} />
      <StatRow label="Phone" value={phone} />
      <StatRow label="Pin Code" value={pinCode} />
      <StatRow label="Email" value={email} />
    </div>

    <div class="flex flex-col gap-[0.25rem] p-[theme(--form-element-field-gap)] rounded-[theme(--radius-md)] bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
      <p class="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-[theme(--form-element-field-gap)]">
        <span aria-hidden="true">📞</span> What happens next
      </p>
      <ul class="text-sm text-[hsl(var(--muted-foreground))] list-disc pl-[1.25rem]">
        <li>A Solar Vipani representative will call you at {phone} within 48 hours</li>
        <li>You'll be connected with 2-3 verified installers working in your area</li>
        <li>Details will also be sent to {email}</li>
      </ul>
    </div>
  </WidgetShell>
{:else}
  <WidgetShell emoji="📝" title={data?.title ?? "Get Your Solar Consultation"}>
    <p class="text-sm text-[hsl(var(--muted-foreground))]">
      {data?.description ??
        "Please fill out the form below and our team will help you get quotations from 2-3 verified installers working in your area."}
    </p>

    {#if prefilledKeys.length}
      <p class="text-xs text-[hsl(var(--muted-foreground))]">
        We've filled in what you already told us — please check it and add the rest.
      </p>
    {/if}

    <form onsubmit={handleSubmit} class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <div class="flex flex-col gap-[0.25rem]">
        <Label for="lead-name">Name</Label>
        <Input id="lead-name" bind:value={name} placeholder="Enter your full name" />
        {#if errors.name}<p class="text-xs text-[hsl(var(--destructive))]">{errors.name}</p>{/if}
      </div>

      <div class="flex flex-col gap-[0.25rem]">
        <Label for="lead-phone">Phone Number</Label>
        <Input id="lead-phone" type="tel" bind:value={phone} placeholder="e.g. +91XXXXXXXXXX" />
        {#if errors.phone}<p class="text-xs text-[hsl(var(--destructive))]">{errors.phone}</p>{/if}
      </div>

      <div class="flex flex-col gap-[0.25rem]">
        <Label for="lead-pincode">Pin Code</Label>
        <Input id="lead-pincode" bind:value={pinCode} placeholder="6-digit pin code" />
        {#if errors.pinCode}<p class="text-xs text-[hsl(var(--destructive))]">{errors.pinCode}</p>{/if}
      </div>

      <div class="flex flex-col gap-[0.25rem]">
        <Label for="lead-email">Email</Label>
        <Input id="lead-email" type="email" bind:value={email} placeholder="Enter your email address" />
        {#if errors.email}<p class="text-xs text-[hsl(var(--destructive))]">{errors.email}</p>{/if}
      </div>

      <div class="flex flex-col gap-[0.25rem]">
        <Label for="lead-type">Consultation Type</Label>
        <Select.Root type="single" bind:value={type}>
          <Select.Trigger id="lead-type">{type || "Select a type"}</Select.Trigger>
          <Select.Content>
            {#each CONSULTATION_TYPES as option (option)}
              <Select.Item value={option} label={option}>{option}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
        {#if errors.type}<p class="text-xs text-[hsl(var(--destructive))]">{errors.type}</p>{/if}
      </div>

      <div class="flex flex-col gap-[0.25rem]">
        <Label for="lead-comment">Your Requirements</Label>
        <Textarea
          id="lead-comment"
          bind:value={comment}
          placeholder="Tell us about your property, energy needs, or specific questions"
        />
        {#if errors.comment}<p class="text-xs text-[hsl(var(--destructive))]">{errors.comment}</p>{/if}
      </div>

      {#if submitError}
        <p class="text-sm text-[hsl(var(--destructive))]">{submitError}</p>
      {/if}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Get My Quotes"}
      </Button>
    </form>
  </WidgetShell>
{/if}
