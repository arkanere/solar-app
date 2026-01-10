<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';

	let name = $state('');
	let phone = $state('');
	let zipCode = $state('');
	let type = $state('');
	let comment = $state('');
	let email = $state('');
	let isSubmitting = $state(false);

	let errors = $state({
		name: '',
		phone: '',
		zipCode: '',
		type: '',
		email: '',
		comment: ''
	});

	let urlParam = $derived($page.url.pathname);

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

	function validateZipCode() {
		if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
			errors.zipCode = 'Zip code must be 5 digits (e.g., 12345) or 9 digits (e.g., 12345-6789)';
			return false;
		}
		errors.zipCode = '';
		return true;
	}

	function validateForm() {
		errors = { name: '', phone: '', zipCode: '', type: '', email: '', comment: '' };
		let isValid = true;

		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}
		if (!validatePhoneNumber()) isValid = false;
		if (!validateZipCode()) isValid = false;
		if (type.trim() === '') {
			errors.type = 'Type is required';
			isValid = false;
		}
		if (!validateEmail()) isValid = false;
		if (comment.trim() === '') {
			errors.comment = 'Comment is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (validateForm()) {
			isSubmitting = true;

			try {
				const response = await fetch('/api/us/submitLead', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name, phone, zipCode, type, comment, email, urlParam })
				});

				const result = await response.json();

				if (result.success) {
					goto('/us/thank-you');
				} else {
					console.error('Submission failed:', result.error);
				}
			} catch (error) {
				console.error('Error submitting form:', error);
			} finally {
				isSubmitting = false;
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class="mx-auto flex max-w-md flex-col gap-4 pt-4">
	<div class="space-y-2">
		<Label for="name">Name</Label>
		<Input id="name" type="text" bind:value={name} placeholder="Enter your name" />
		{#if errors.name}
			<p class="text-sm text-destructive">{errors.name}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="phone">Phone Number</Label>
		<Input
			id="phone"
			type="text"
			bind:value={phone}
			placeholder="+1234567890"
			onblur={validatePhoneNumber}
		/>
		{#if errors.phone}
			<p class="text-sm text-destructive">{errors.phone}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="zipCode">Zip Code</Label>
		<Input
			id="zipCode"
			type="text"
			bind:value={zipCode}
			placeholder="12345"
			onblur={validateZipCode}
		/>
		{#if errors.zipCode}
			<p class="text-sm text-destructive">{errors.zipCode}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="email">Email</Label>
		<Input
			id="email"
			type="email"
			bind:value={email}
			placeholder="your@email.com"
			onblur={validateEmail}
		/>
		{#if errors.email}
			<p class="text-sm text-destructive">{errors.email}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="type">Type of Consultation</Label>
		<Select.Root type="single" bind:value={type}>
			<Select.Trigger id="type" class="w-full">
				{type || 'Select type of consultation'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="Bungalow with terrace">Bungalow with terrace</Select.Item>
				<Select.Item value="Common area requirement for Apartments/Housing societies">
					Common area requirement for Apartments/Housing societies
				</Select.Item>
				<Select.Item value="Business/Commercial">Business/Commercial</Select.Item>
			</Select.Content>
		</Select.Root>
		{#if errors.type}
			<p class="text-sm text-destructive">{errors.type}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="comment">Comment</Label>
		<Textarea
			id="comment"
			bind:value={comment}
			placeholder="Tell us more about your requirement"
			rows={4}
		/>
		{#if errors.comment}
			<p class="text-sm text-destructive">{errors.comment}</p>
		{/if}
	</div>

	<Button type="submit" disabled={isSubmitting} class="w-full">
		{isSubmitting ? 'Submitting...' : 'Submit'}
	</Button>
</form>
