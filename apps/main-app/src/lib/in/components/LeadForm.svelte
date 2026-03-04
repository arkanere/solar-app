<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Card from '$lib/components/ui/card';
  import * as Alert from '$lib/components/ui/alert';
  import { goto } from '$app/navigation';
  import { validatePhone, validateEmail, validatePinCode } from '$lib/constants/formValidation';

  interface Props {
    heading?: string;
    description?: string;
    showWrapper?: boolean;
    submitLabel?: string;
  }

  let { heading = 'Share Your Details', description = '', showWrapper = true, submitLabel = 'Get Free Quotes' } = $props();

  let name = $state('');
  let phone = $state('');
  let pinCode = $state('');
  let email = $state('');
  let comment = $state('');
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
      pinCode: !validatePinCode(pinCode) ? 'Valid 6-digit pin code required' : '',
      email: !validateEmail(email) ? 'Valid email required' : '',
      comment: !comment.trim() ? 'Comments required' : ''
    };

    return !Object.values(errors).some((err) => err !== '');
  }

  async function handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    if (!validateForm()) return;

    isSubmitting = true;

    // Navigate to thank-you page immediately for better UX
    goto('/in/thank-you');

    // Submit form in background (fire and forget)
    fetch('/in/api/submitLead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        pinCode,
        email,
        comment,
        urlParam
      })
    }).catch((error) => {
      console.error('Error submitting form:', error);
    });
  }
</script>

{#if showWrapper}
  <div class="py-[theme(--button-padding-y-default)] flex justify-center">
    <Card.Root class="w-full max-w-[theme(--max-width-md)]">
      <Card.Header class="py-[theme(--card-padding-y)]">
        <h2 class="text-[theme(--font-size-lg)] font-semibold tracking-[theme(--tracking-ui)]">{heading}</h2>
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
            <Label for="pinCode">Pin Code</Label>
            <Input
              id="pinCode"
              bind:value={pinCode}
              type="text"
              placeholder="6-digit pin code"
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

          <!-- Submit Button -->
          <Button
            type="submit"
            class="w-full mt-[theme(--spacing-sm)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all duration-[theme(--transition-default)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : submitLabel}
          </Button>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
{:else}
  <div class="w-full max-w-[theme(--max-width-md)] mx-auto py-[theme(--button-padding-y-default)]">
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
      <Label for="pinCode">Pin Code</Label>
      <Input
        id="pinCode"
        bind:value={pinCode}
        type="text"
        placeholder="6-digit pin code"
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

    <!-- Submit Button -->
    <Button
      type="submit"
      class="w-full mt-[theme(--spacing-sm)] hover:-translate-y-[theme(--hover-lift-sm)] transition-all duration-[theme(--transition-default)]"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Submitting...' : submitLabel}
    </Button>
    </form>
  </div>
{/if}
