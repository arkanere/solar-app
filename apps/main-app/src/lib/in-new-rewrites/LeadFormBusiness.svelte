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

<div class="flex items-center justify-center" style="padding-top: var(--button-padding-y-default); padding-bottom: var(--button-padding-y-default);">
  <Card.Root style="width: 100%; max-width: var(--max-width-md);">
    <Card.Content style="padding-top: var(--card-padding-y);">
      <form onsubmit={handleSubmit} style="gap: var(--form-field-gap); display: flex; flex-direction: column;">
        <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
          <Label for="name">Name</Label>
          <Input
            id="name"
            bind:value={name}
            type="text"
            placeholder="Your name"
            disabled={isSubmitting}
            style="margin-top: var(--form-element-field-gap);"
          />
          {#if errors.name}
            <Alert.Root variant="destructive" style="margin-top: var(--form-element-field-gap);">
              <Alert.Description>{errors.name}</Alert.Description>
            </Alert.Root>
          {/if}
        </div>

        <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
          <Label for="phone">Phone</Label>
          <Input
            id="phone"
            bind:value={phone}
            type="text"
            placeholder="10-digit phone number"
            disabled={isSubmitting}
            style="margin-top: var(--form-element-field-gap);"
          />
          {#if errors.phone}
            <Alert.Root variant="destructive" style="margin-top: var(--form-element-field-gap);">
              <Alert.Description>{errors.phone}</Alert.Description>
            </Alert.Root>
          {/if}
        </div>

        <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
          <Label for="pinCode">Pin Code</Label>
          <Input
            id="pinCode"
            bind:value={pinCode}
            type="text"
            placeholder="6-digit pin code"
            disabled={isSubmitting}
            style="margin-top: var(--form-element-field-gap);"
          />
          {#if errors.pinCode}
            <Alert.Root variant="destructive" style="margin-top: var(--form-element-field-gap);">
              <Alert.Description>{errors.pinCode}</Alert.Description>
            </Alert.Root>
          {/if}
        </div>

        <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
          <Label for="email">Email</Label>
          <Input
            id="email"
            bind:value={email}
            type="email"
            placeholder="your@email.com"
            disabled={isSubmitting}
            style="margin-top: var(--form-element-field-gap);"
          />
          {#if errors.email}
            <Alert.Root variant="destructive" style="margin-top: var(--form-element-field-gap);">
              <Alert.Description>{errors.email}</Alert.Description>
            </Alert.Root>
          {/if}
        </div>

        <div style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
          <Label for="comment">Comments</Label>
          <Textarea
            id="comment"
            bind:value={comment}
            placeholder="Tell us about your solar system requirements..."
            disabled={isSubmitting}
            style="margin-top: var(--form-element-field-gap); min-height: 120px;"
          />
          {#if errors.comment}
            <Alert.Root variant="destructive" style="margin-top: var(--form-element-field-gap);">
              <Alert.Description>{errors.comment}</Alert.Description>
            </Alert.Root>
          {/if}
        </div>

        <Button type="submit" class="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
