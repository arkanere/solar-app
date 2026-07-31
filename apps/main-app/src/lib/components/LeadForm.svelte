<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Card from '$lib/components/ui/card';
  import * as Alert from '$lib/components/ui/alert';
  import { validatePhone, validateEmail, validatePinCode } from '$lib/constants/formValidation';
  import { capture } from '$lib/posthog';
  import type { CountryConfig } from '$lib/countries';

  interface Props {
    heading?: string;
    description?: string;
    showWrapper?: boolean;
    submitLabel?: string;
    country?: CountryConfig | null;
  }

  let { heading = 'Share Your Details', showWrapper = true, submitLabel = 'Get Free Quotes', country = null }: Props = $props();

  // Without a country config the form keeps its original India behavior.
  const isIndia = $derived(!country || country.code === 'in');
  const postalLabel = $derived(country ? country.postalCode.label : 'Pin Code');
  const postalPlaceholder = $derived(
    country ? `${country.postalCode.maxLength}-digit ${country.postalCode.label.toLowerCase()}` : '6-digit pin code'
  );

  function validatePostalCode(value: string): boolean {
    if (!country) return validatePinCode(value);
    return new RegExp(country.postalCode.pattern).test(value);
  }

  let name = $state('');
  let phone = $state('');
  let pinCode = $state('');
  let email = $state('');
  let comment = $state('');
  let consent = $state(false);
  let isSubmitting = $state(false);

  let errors = $state({
    name: '',
    phone: '',
    pinCode: '',
    email: '',
    comment: ''
  });

  let urlParam = $derived($page.url.pathname);

  function validateForm(): boolean {
    errors = {
      name: !name.trim() ? 'Name is required' : '',
      phone: !validatePhone(phone) ? 'Valid phone number required (10-16 digits)' : '',
      pinCode: !validatePostalCode(pinCode)
        ? `Valid ${country ? country.postalCode.maxLength : 6}-digit ${postalLabel.toLowerCase()} required`
        : '',
      email: !validateEmail(email) ? 'Valid email required' : '',
      comment: !comment.trim() ? 'Comments required' : ''
    };

    return !Object.values(errors).some((err) => err !== '');
  }

  async function handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    if (!validateForm() || !consent) return;

    isSubmitting = true;

    capture('quote_submitted', { source_url: urlParam });

    // India keeps its original user-app lead flow; other countries submit to
    // the unified same-site endpoint.
    const submitUrl = isIndia
      ? 'https://user.solarvipani.com/in/api/submitLead'
      : `/${country!.code}/api/submitLead`;

    fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        name,
        phone,
        pinCode,
        email,
        comment,
        urlParam,
        marketing_consent: consent
      })
    }).catch((error) => {
      console.error('Error submitting form:', error);
    });

    window.location.href = isIndia
      ? `https://user.solarvipani.com/in/thank-you?pincode=${encodeURIComponent(pinCode)}`
      : `/${country!.code}/thank-you`;
  }
</script>

{#if showWrapper}
  <div class="py-[theme(--button-padding-y-default)] flex justify-center">
    <Card.Root class="w-full max-w-md">
      <Card.Header class="py-[theme(--card-padding-y)]">
        <h2 class="text-lg font-semibold tracking-[theme(--tracking-ui)]">{heading}</h2>
      </Card.Header>

      <Card.Content class="pb-[theme(--card-padding-y)]">
        <form onsubmit={handleSubmit} class="flex flex-col gap-[theme(--form-field-gap)]">
          <!-- Name Field -->
          <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
            <Label for="name">Name</Label>
            <Input
              id="name"
              bind:value={name}
              type="text"
              placeholder="Your name"
              disabled={isSubmitting}
            />
            {#if errors.name}
              <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
                <Alert.Description>{errors.name}</Alert.Description>
              </Alert.Root>
            {/if}
          </div>

          <!-- Phone Field -->
          <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
            <Label for="phone">Phone Number</Label>
            <Input
              id="phone"
              bind:value={phone}
              type="tel"
              placeholder="10-16 digit phone number"
              disabled={isSubmitting}
              inputmode="numeric"
            />
            {#if errors.phone}
              <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
                <Alert.Description>{errors.phone}</Alert.Description>
              </Alert.Root>
            {/if}
          </div>

          <!-- Pin Code Field -->
          <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
            <Label for="pinCode">{postalLabel}</Label>
            <Input
              id="pinCode"
              bind:value={pinCode}
              type="text"
              placeholder={postalPlaceholder}
              disabled={isSubmitting}
              inputmode="numeric"
            />
            {#if errors.pinCode}
              <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
                <Alert.Description>{errors.pinCode}</Alert.Description>
              </Alert.Root>
            {/if}
          </div>

          <!-- Email Field -->
          <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
            <Label for="email">Email Address</Label>
            <Input
              id="email"
              bind:value={email}
              type="email"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {#if errors.email}
              <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
                <Alert.Description>{errors.email}</Alert.Description>
              </Alert.Root>
            {/if}
          </div>

          <!-- Comments Field -->
          <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
            <Label for="comment">System Requirements</Label>
            <Textarea
              id="comment"
              bind:value={comment}
              placeholder="Tell us about your solar system requirements..."
              disabled={isSubmitting}
              class="min-h-[theme(--textarea-min-height)]"
            />
            {#if errors.comment}
              <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
                <Alert.Description>{errors.comment}</Alert.Description>
              </Alert.Root>
            {/if}
          </div>

          <!-- Consent Checkbox -->
          <label class="flex items-start gap-2 text-sm leading-snug cursor-pointer">
            <input
              type="checkbox"
              bind:checked={consent}
              disabled={isSubmitting}
              class="mt-0.5 h-4 w-4 flex-shrink-0"
            />
            <span>
              I consent to Solar Vipani sharing my contact details with solar
              installers in my area to follow up on my inquiry.
            </span>
          </label>

          <!-- Submit Button -->
          <Button
            type="submit"
            class="w-full mt-2 hover:-translate-y-[theme(--hover-lift-sm)] transition-all duration-[theme(--transition-default)]"
            disabled={isSubmitting || !consent}
          >
            {isSubmitting ? 'Submitting...' : submitLabel}
          </Button>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
{:else}
  <div class="w-full max-w-md mx-auto py-[theme(--button-padding-y-default)]">
    <form onsubmit={handleSubmit} class="flex flex-col gap-[theme(--form-field-gap)]">
    <!-- Name Field -->
    <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <Label for="name">Name</Label>
      <Input
        id="name"
        bind:value={name}
        type="text"
        placeholder="Your name"
        disabled={isSubmitting}
      />
      {#if errors.name}
        <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
          <Alert.Description>{errors.name}</Alert.Description>
        </Alert.Root>
      {/if}
    </div>

    <!-- Phone Field -->
    <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <Label for="phone">Phone Number</Label>
      <Input
        id="phone"
        bind:value={phone}
        type="tel"
        placeholder="10-16 digit phone number"
        disabled={isSubmitting}
        inputmode="numeric"
      />
      {#if errors.phone}
        <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
          <Alert.Description>{errors.phone}</Alert.Description>
        </Alert.Root>
      {/if}
    </div>

    <!-- Pin Code Field -->
    <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <Label for="pinCode">{postalLabel}</Label>
      <Input
        id="pinCode"
        bind:value={pinCode}
        type="text"
        placeholder={postalPlaceholder}
        disabled={isSubmitting}
        inputmode="numeric"
      />
      {#if errors.pinCode}
        <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
          <Alert.Description>{errors.pinCode}</Alert.Description>
        </Alert.Root>
      {/if}
    </div>

    <!-- Email Field -->
    <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <Label for="email">Email Address</Label>
      <Input
        id="email"
        bind:value={email}
        type="email"
        placeholder="your@email.com"
        disabled={isSubmitting}
      />
      {#if errors.email}
        <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
          <Alert.Description>{errors.email}</Alert.Description>
        </Alert.Root>
      {/if}
    </div>

    <!-- Comments Field -->
    <div class="flex flex-col gap-[theme(--form-element-field-gap)]">
      <Label for="comment">System Requirements</Label>
      <Textarea
        id="comment"
        bind:value={comment}
        placeholder="Tell us about your solar system requirements..."
        disabled={isSubmitting}
        class="min-h-[theme(--textarea-min-height)]"
      />
      {#if errors.comment}
        <Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
          <Alert.Description>{errors.comment}</Alert.Description>
        </Alert.Root>
      {/if}
    </div>

    <!-- Consent Checkbox -->
    <label class="flex items-start gap-2 text-sm leading-snug cursor-pointer">
      <input
        type="checkbox"
        bind:checked={consent}
        disabled={isSubmitting}
        class="mt-0.5 h-4 w-4 flex-shrink-0"
      />
      <span>
        I consent to Solar Vipani sharing my contact details with solar
        installers in my area to follow up on my inquiry.
      </span>
    </label>

    <!-- Submit Button -->
    <Button
      type="submit"
      class="w-full mt-2 hover:-translate-y-[theme(--hover-lift-sm)] transition-all duration-[theme(--transition-default)]"
      disabled={isSubmitting || !consent}
    >
      {isSubmitting ? 'Submitting...' : submitLabel}
    </Button>
    </form>
  </div>
{/if}
