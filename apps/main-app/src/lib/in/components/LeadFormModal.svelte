<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { validateLeadForm } from '$lib/constants/formValidation';

	let { businessName = '', businessSlug = '' } = $props();

	let name = $state('');
	let phone = $state('');
	let pinCode = $state('');
	let type = $state('');
	let comment = $state('');
	let email = $state('');
	let isSubmitting = $state(false);
	let errors = $state<any>({});

	const consultationTypes = [
		'Residential - Independent Home',
		'Residential - Apartments/Housing societies',
		'Business/Commercial'
	];

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		const { isValid, errors: newErrors } = validateLeadForm(
			name,
			phone,
			pinCode,
			email,
			type,
			comment
		);

		errors = newErrors;

		if (isValid) {
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
					type,
					comment,
					email,
					urlParam: `/solar-panel-installer/${businessSlug}`,
					businessName
				})
			}).catch((error) => {
				console.error('Error submitting form:', error);
			});
		}
	}
</script>

<form
	onsubmit={handleSubmit}
	class="flex flex-col gap-[theme(--spacing-lg)] max-w-[theme(--max-width-sm)] mx-auto p-[theme(--form-field-gap)]"
>
	<!-- Name -->
	<div class="flex flex-col gap-[theme(--spacing-sm)]">
		<Label for="name">Name</Label>
		<Input id="name" type="text" bind:value={name} placeholder="Enter your name" />
		{#if errors.name}
			<Alert variant="destructive">
				<AlertDescription>{errors.name}</AlertDescription>
			</Alert>
		{/if}
	</div>

	<!-- Phone Number -->
	<div class="flex flex-col gap-[theme(--spacing-sm)]">
		<Label for="phone">Phone Number</Label>
		<Input
			id="phone"
			type="text"
			bind:value={phone}
			placeholder="Enter your phone number"
		/>
		{#if errors.phone}
			<Alert variant="destructive">
				<AlertDescription>{errors.phone}</AlertDescription>
			</Alert>
		{/if}
	</div>

	<!-- Pin Code -->
	<div class="flex flex-col gap-[theme(--spacing-sm)]">
		<Label for="pincode">Pin Code</Label>
		<Input
			id="pincode"
			type="text"
			bind:value={pinCode}
			placeholder="Enter your 6-digit pin code"
		/>
		{#if errors.pinCode}
			<Alert variant="destructive">
				<AlertDescription>{errors.pinCode}</AlertDescription>
			</Alert>
		{/if}
	</div>

	<!-- Email -->
	<div class="flex flex-col gap-[theme(--spacing-sm)]">
		<Label for="email">Email</Label>
		<Input id="email" type="email" bind:value={email} placeholder="Enter your email" />
		{#if errors.email}
			<Alert variant="destructive">
				<AlertDescription>{errors.email}</AlertDescription>
			</Alert>
		{/if}
	</div>

	<!-- Type of Consultation -->
	<div class="flex flex-col gap-[theme(--spacing-sm)]">
		<Label for="type">Type of Consultation</Label>
		<Select.Root type="single" bind:value={type}>
			<Select.Trigger id="type">
				{type || 'Select type of consultation'}
			</Select.Trigger>
			<Select.Content>
				{#each consultationTypes as consultType}
					<Select.Item value={consultType}>
						{consultType}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		{#if errors.type}
			<Alert variant="destructive">
				<AlertDescription>{errors.type}</AlertDescription>
			</Alert>
		{/if}
	</div>

	<!-- Comment -->
	<div class="flex flex-col gap-[theme(--spacing-sm)]">
		<Label for="comment">Comment</Label>
		<Textarea
			id="comment"
			bind:value={comment}
			placeholder="Tell us more about your requirement"
			class="resize-none"
		/>
		{#if errors.comment}
			<Alert variant="destructive">
				<AlertDescription>{errors.comment}</AlertDescription>
			</Alert>
		{/if}
	</div>

	<!-- Submit Button -->
	<Button type="submit" disabled={isSubmitting} class="w-full">
		{isSubmitting ? 'Submitting...' : 'Submit'}
	</Button>
</form>
