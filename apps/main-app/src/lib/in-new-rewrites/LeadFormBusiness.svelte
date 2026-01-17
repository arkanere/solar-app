<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Card from '$lib/components/ui/card';
  import { goto } from '$app/navigation';
  import { validatePhone, validateEmail, validatePinCode } from '$lib/constants/formValidation';

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

  let urlParam = $state('');

  $effect(() => {
    urlParam = $page.url.pathname;
  });

  const validateForm = () => {
    errors = {
      name: !name.trim() ? 'Name is required' : '',
      phone: !validatePhone(phone) ? 'Valid phone number required (10-16 digits)' : '',
      pinCode: !validatePinCode(pinCode) ? 'Valid 6-digit pin code required' : '',
      email: !validateEmail(email) ? 'Valid email required' : '',
      comment: !comment.trim() ? 'Comments required' : ''
    };

    return !Object.values(errors).some((err) => err !== '');
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    isSubmitting = true;
    try {
      const response = await fetch('/api/submitLead', {
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
      });

      if (response.ok) {
        const data = await response.json();
        await goto(`/thank-you?ref=${data.referenceId || ''}`);
      } else {
        console.error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<div class="flex items-center justify-center py-4">
  <Card.Root class="w-full max-w-md md:max-w-none">
    <Card.Content class="pt-6">
      <form onsubmit={handleSubmit} class="space-y-4">
        <div>
          <Label for="name">Name</Label>
          <Input
            id="name"
            bind:value={name}
            type="text"
            placeholder="Your name"
            disabled={isSubmitting}
            class="mt-1"
          />
          {#if errors.name}
            <p class="text-sm text-destructive mt-1">{errors.name}</p>
          {/if}
        </div>

        <div>
          <Label for="phone">Phone</Label>
          <Input
            id="phone"
            bind:value={phone}
            type="text"
            placeholder="10-digit phone number"
            disabled={isSubmitting}
            class="mt-1"
          />
          {#if errors.phone}
            <p class="text-sm text-destructive mt-1">{errors.phone}</p>
          {/if}
        </div>

        <div>
          <Label for="pinCode">Pin Code</Label>
          <Input
            id="pinCode"
            bind:value={pinCode}
            type="text"
            placeholder="6-digit pin code"
            disabled={isSubmitting}
            class="mt-1"
          />
          {#if errors.pinCode}
            <p class="text-sm text-destructive mt-1">{errors.pinCode}</p>
          {/if}
        </div>

        <div>
          <Label for="email">Email</Label>
          <Input
            id="email"
            bind:value={email}
            type="email"
            placeholder="your@email.com"
            disabled={isSubmitting}
            class="mt-1"
          />
          {#if errors.email}
            <p class="text-sm text-destructive mt-1">{errors.email}</p>
          {/if}
        </div>

        <div>
          <Label for="comment">Comments</Label>
          <Textarea
            id="comment"
            bind:value={comment}
            placeholder="Tell us about your solar system requirements..."
            disabled={isSubmitting}
            class="mt-1 min-h-[120px]"
          />
          {#if errors.comment}
            <p class="text-sm text-destructive mt-1">{errors.comment}</p>
          {/if}
        </div>

        <Button type="submit" class="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
