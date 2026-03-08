<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { validatePhone, validateEmail } from '$lib/constants/formValidation';

	interface Props {
		district?: string;
		stateName?: string;
	}

	let { district = '', stateName = '' } = $props();

	let businessName = $state('');
	let contactName = $state('');
	let phone = $state('');
	let email = $state('');
	let city = $state(district);
	let services = $state('');
	let experience = $state('');
	let isSubmitting = $state(false);
	let submitError = $state('');

	let errors = $state({
		businessName: '',
		contactName: '',
		phone: '',
		email: '',
		city: '',
		services: ''
	});

	function validateForm(): boolean {
		errors = {
			businessName: !businessName.trim() ? 'Business name is required' : '',
			contactName: !contactName.trim() ? 'Contact name is required' : '',
			phone: !validatePhone(phone) ? 'Valid phone number required (10-16 digits)' : '',
			email: !validateEmail(email) ? 'Valid email required' : '',
			city: !city.trim() ? 'City is required' : '',
			services: !services.trim() ? 'Please describe your services' : ''
		};
		return !Object.values(errors).some((err) => err !== '');
	}

	async function handleSubmit(e: SubmitEvent): Promise<void> {
		e.preventDefault();
		if (!validateForm()) return;

		isSubmitting = true;
		submitError = '';

		try {
			const res = await fetch('/in/api/submitPartner', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					businessName,
					contactName,
					phone,
					email,
					city,
					district: district || city,
					state: stateName,
					services,
					experience
				})
			});

			const result = await res.json();

			if (result.success) {
				goto('/in/partners/join/thank-you');
			} else {
				submitError = result.error || 'Something went wrong. Please try again.';
				isSubmitting = false;
			}
		} catch {
			submitError = 'Network error. Please try again.';
			isSubmitting = false;
		}
	}
</script>

<Card.Root class="w-full max-w-md">
	<Card.Header class="py-[theme(--card-padding-y)]">
		<h2 class="text-lg font-semibold tracking-[theme(--tracking-ui)]">Partner Sign-Up</h2>
		<p class="text-sm text-muted-foreground">Join our installer network and start receiving leads</p>
	</Card.Header>

	<Card.Content class="pb-[theme(--card-padding-y)]">
		{#if submitError}
			<Alert.Root variant="destructive" class="mb-4">
				<Alert.Description>{submitError}</Alert.Description>
			</Alert.Root>
		{/if}

		<form onsubmit={handleSubmit} class="flex flex-col gap-[theme(--form-field-gap)]">
			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label for="businessName">Business Name</Label>
				<Input id="businessName" bind:value={businessName} type="text" placeholder="Your solar business name" disabled={isSubmitting} />
				{#if errors.businessName}
					<Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
						<Alert.Description>{errors.businessName}</Alert.Description>
					</Alert.Root>
				{/if}
			</div>

			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label for="contactName">Contact Person</Label>
				<Input id="contactName" bind:value={contactName} type="text" placeholder="Your full name" disabled={isSubmitting} />
				{#if errors.contactName}
					<Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
						<Alert.Description>{errors.contactName}</Alert.Description>
					</Alert.Root>
				{/if}
			</div>

			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label for="phone">Phone Number</Label>
				<Input id="phone" bind:value={phone} type="tel" placeholder="10-16 digit phone number" disabled={isSubmitting} inputmode="numeric" />
				{#if errors.phone}
					<Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
						<Alert.Description>{errors.phone}</Alert.Description>
					</Alert.Root>
				{/if}
			</div>

			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label for="email">Email Address</Label>
				<Input id="email" bind:value={email} type="email" placeholder="business@example.com" disabled={isSubmitting} />
				{#if errors.email}
					<Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
						<Alert.Description>{errors.email}</Alert.Description>
					</Alert.Root>
				{/if}
			</div>

			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label for="city">City / District</Label>
				<Input id="city" bind:value={city} type="text" placeholder="Your primary service area" disabled={isSubmitting || !!district} />
				{#if errors.city}
					<Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
						<Alert.Description>{errors.city}</Alert.Description>
					</Alert.Root>
				{/if}
			</div>

			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label for="services">Services Offered</Label>
				<Textarea
					id="services"
					bind:value={services}
					placeholder="e.g. Residential installation, commercial projects, maintenance..."
					disabled={isSubmitting}
					class="min-h-[theme(--textarea-min-height)]"
				/>
				{#if errors.services}
					<Alert.Root variant="destructive" class="mt-[theme(--form-element-field-gap)]">
						<Alert.Description>{errors.services}</Alert.Description>
					</Alert.Root>
				{/if}
			</div>

			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label for="experience">Years of Experience (optional)</Label>
				<Input id="experience" bind:value={experience} type="text" placeholder="e.g. 5 years" disabled={isSubmitting} />
			</div>

			<Button
				type="submit"
				class="mt-2 w-full transition-all duration-[theme(--transition-default)] hover:-translate-y-[theme(--hover-lift-sm)]"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Submitting...' : 'Join as Partner'}
			</Button>
		</form>
	</Card.Content>
</Card.Root>
