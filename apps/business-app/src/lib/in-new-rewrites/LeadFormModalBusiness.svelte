<script module lang="ts">
	export type LeadFormModalBusinessProps = {
		businessName?: string;
		businessSlug?: string;
		onLeadAdded?: () => void;
	};
</script>

<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { CheckCircle, AlertCircle } from '@lucide/svelte';

	let { businessName = '', businessSlug = '', onLeadAdded = () => {} }: LeadFormModalBusinessProps = $props();

	let name = $state('');
	let phone = $state('');
	let pinCode = $state('');
	let comment = $state('');
	let email = $state('');

	const commentPlaceholder = `Tell us about your requirement.
Eg. I want 3kW system for my Home or I want to install solar at my factory`;

	let isSubmitting = $state(false);
	let submitSuccess = $state(false);
	let submitMessage = $state('');

	let errors = $state({
		name: '',
		phone: '',
		pinCode: '',
		email: '',
		comment: ''
	});

	let urlParam = $derived(`/solar-panel-installer/${businessSlug}`);

	function validatePhoneNumber() {
		if (!/^\+?\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits, optionally starting with +';
			return false;
		}
		errors.phone = '';
		return true;
	}

	function validateEmail() {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Invalid email address';
			return false;
		}
		errors.email = '';
		return true;
	}

	function validatePinCode() {
		if (!/^\d{6}$/.test(pinCode)) {
			errors.pinCode = 'Pin code must be exactly 6 digits';
			return false;
		}
		errors.pinCode = '';
		return true;
	}

	function validateForm() {
		errors = { name: '', phone: '', pinCode: '', email: '', comment: '' };
		let isValid = true;

		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}
		if (!validatePhoneNumber()) isValid = false;
		if (!validatePinCode()) isValid = false;
		if (!validateEmail()) isValid = false;
		if (comment.trim() === '') {
			errors.comment = 'Comment is required';
			isValid = false;
		}

		return isValid;
	}

	function resetForm() {
		name = '';
		phone = '';
		pinCode = '';
		comment = '';
		email = '';
		errors = { name: '', phone: '', pinCode: '', email: '', comment: '' };
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (validateForm()) {
			isSubmitting = true;
			submitSuccess = false;
			submitMessage = '';

			try {
				const response = await fetch('/in/api/submitLead', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name,
						phone,
						pinCode,
						comment,
						email,
						urlParam,
						businessName
					})
				});

				const result = await response.json();

				if (result.success) {
					submitSuccess = true;
					submitMessage = 'Lead added successfully!';
					resetForm();
					onLeadAdded();
				} else {
					submitMessage = 'Failed to add lead. Please try again.';
					console.error('Submission failed:', result.error);
				}
			} catch (error) {
				submitMessage = 'An error occurred. Please try again.';
				console.error('Error submitting form:', error);
			} finally {
				isSubmitting = false;
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col max-w-[400px] mx-auto pt-4 max-md:max-w-full max-md:p-0">
	{#if submitMessage}
		<Alert.Root variant={submitSuccess ? 'default' : 'destructive'} class="mb-4">
			{#if submitSuccess}
				<CheckCircle class="h-4 w-4" />
			{:else}
				<AlertCircle class="h-4 w-4" />
			{/if}
			<Alert.Description>{submitMessage}</Alert.Description>
		</Alert.Root>
	{/if}

	<div class="space-y-4">
		<div>
			<Label for="name" class="font-semibold">Name</Label>
			<Input id="name" type="text" bind:value={name} class="mt-2" />
			{#if errors.name}
				<p class="text-destructive text-sm mt-1">{errors.name}</p>
			{/if}
		</div>

		<div>
			<Label for="phone" class="font-semibold">Phone Number</Label>
			<Input id="phone" type="text" bind:value={phone} onblur={validatePhoneNumber} class="mt-2" />
			{#if errors.phone}
				<p class="text-destructive text-sm mt-1">{errors.phone}</p>
			{/if}
		</div>

		<div>
			<Label for="pinCode" class="font-semibold">Pin Code</Label>
			<Input id="pinCode" type="text" bind:value={pinCode} onblur={validatePinCode} class="mt-2" />
			{#if errors.pinCode}
				<p class="text-destructive text-sm mt-1">{errors.pinCode}</p>
			{/if}
		</div>

		<div>
			<Label for="email" class="font-semibold">Email</Label>
			<Input id="email" type="email" bind:value={email} onblur={validateEmail} class="mt-2" />
			{#if errors.email}
				<p class="text-destructive text-sm mt-1">{errors.email}</p>
			{/if}
		</div>

		<div>
			<Label for="comment" class="font-semibold">Comment</Label>
			<Textarea
				id="comment"
				bind:value={comment}
				placeholder={commentPlaceholder}
				class="mt-2 h-[7.5em]"
			/>
			{#if errors.comment}
				<p class="text-destructive text-sm mt-1">{errors.comment}</p>
			{/if}
		</div>

		<Button
			type="submit"
			disabled={isSubmitting}
			class="w-full bg-success hover:bg-success/90 text-success-foreground"
		>
			{isSubmitting ? 'Adding Lead...' : 'Add Lead'}
		</Button>
	</div>
</form>
