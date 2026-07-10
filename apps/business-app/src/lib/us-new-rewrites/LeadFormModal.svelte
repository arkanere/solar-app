<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	let { businessName = '', businessSlug = '' } = $props();

	let name = $state('');
	let phone = $state('');
	let pinCode = $state('');
	let type = $state('');
	let comment = $state('');
	let email = $state('');

	let isSubmitting = $state(false);

	let errors = $state({
		name: '',
		phone: '',
		pinCode: '',
		type: '',
		email: '',
		comment: ''
	});

	let urlParam = $derived(`/solar-panel-installer/${businessSlug}`);

	function validatePhoneNumber() {
		if (!/^\+?\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits, optionally starting with +';
			return false;
		} else {
			errors.phone = '';
			return true;
		}
	}

	function validateEmail() {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Invalid email address';
			return false;
		} else {
			errors.email = '';
			return true;
		}
	}

	function validatePinCode() {
		if (!/^\d{5}$/.test(pinCode)) {
			errors.pinCode = 'Zip code must be exactly 5 digits';
			return false;
		} else {
			errors.pinCode = '';
			return true;
		}
	}

	function validateForm() {
		errors = { name: '', phone: '', pinCode: '', type: '', email: '', comment: '' };
		let isValid = true;

		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}
		if (!validatePhoneNumber()) isValid = false;
		if (!validatePinCode()) isValid = false;
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
				const response = await fetch('/api/submitLead', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name,
						phone,
						pinCode,
						type,
						comment,
						email,
						urlParam,
						businessName
					})
				});

				const result = await response.json();

				if (result.success) {
					goto('/thank-you');
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

<form onsubmit={handleSubmit} class="flex flex-col max-w-md mx-auto pt-4 space-y-4">
	<h2 class="text-2xl font-bold mb-4">Request a Free Quote from {businessName}</h2>

	<div class="space-y-2">
		<Label for="name">Name</Label>
		<Input id="name" type="text" bind:value={name} />
		{#if errors.name}
			<p class="text-sm text-destructive">{errors.name}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="phone">Phone Number</Label>
		<Input id="phone" type="text" bind:value={phone} onblur={validatePhoneNumber} />
		{#if errors.phone}
			<p class="text-sm text-destructive">{errors.phone}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="pinCode">Zip Code</Label>
		<Input id="pinCode" type="text" bind:value={pinCode} onblur={validatePinCode} />
		{#if errors.pinCode}
			<p class="text-sm text-destructive">{errors.pinCode}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="email">Email</Label>
		<Input id="email" type="email" bind:value={email} onblur={validateEmail} />
		{#if errors.email}
			<p class="text-sm text-destructive">{errors.email}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="type">Type of Consultation</Label>
		<Select.Root type="single" bind:value={type}>
			<Select.Trigger id="type">
				{type || 'Select type of consultation'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="Residential - Independent Home">Residential - Independent Home</Select.Item>
				<Select.Item value="Residential - Apartments/Housing societies"
					>Residential - Apartments/Housing societies</Select.Item
				>
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
		/>
		{#if errors.comment}
			<p class="text-sm text-destructive">{errors.comment}</p>
		{/if}
	</div>

	<Button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Submitting...' : 'Submit'}
	</Button>
</form>
