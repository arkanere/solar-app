<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let message = $state('');

	let errors = $state({
		name: '',
		phone: '',
		email: '',
		message: ''
	});

	// Get the business_slug from the URL
	let business_slug = $derived($page.params.business_slug);

	function validateForm() {
		errors = {
			name: '',
			phone: '',
			email: '',
			message: ''
		};

		let isValid = true;

		// Validation for Name
		if (name.trim() === '') {
			errors.name = 'Name is required';
			isValid = false;
		}

		// Validation for Phone Number
		if (!/^\d{10,16}$/.test(phone)) {
			errors.phone = 'Phone number must be between 10 and 16 digits';
			isValid = false;
		}

		// Validation for Email
		if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			errors.email = 'Valid email is required';
			isValid = false;
		}

		// Validation for Message
		if (message.trim() === '') {
			errors.message = 'Message is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (validateForm()) {
			try {
				const response = await fetch('/in/api/submitClaim', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, phone, email, message, business_slug })
				});

				const result = await response.json();

				if (result.success) {
					goto('/thank-you');
				} else {
					console.error('Submission failed:', result.error);
				}
			} catch (error) {
				console.error('Error submitting form:', error);
			}
		}
	}
</script>

<svelte:head>
	<title>Claim Your Business | Solar Vipani</title>
	<meta
		name="description"
		content="Claim your business listing on Solar Vipani to manage your profile and connect with customers."
	/>
</svelte:head>

<main
	class="flex flex-col items-center justify-center p-12 md:p-6 bg-background text-foreground transition-colors duration-300"
>
	<div class="mb-8 text-center max-w-xl">
		<h1 class="text-3xl md:text-2xl font-semibold mb-6">Claim Your Business</h1>
		<h2 class="text-xl font-medium mb-4 text-accent">Benefits:</h2>
		<div class="space-y-2 text-foreground-secondary">
			<p>Listing is FREE</p>
			<p>Add phone number on the profile page so that customer can call directly</p>
			<p>Get 'Verified Business' tag, rank above non-tagged businesses</p>
			<p>Add Recent Projects</p>
			<p>Update business details such as phone number, email, website address when they change</p>
		</div>
	</div>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit(e);
		}}
		class="w-full max-w-[600px] bg-card p-8 md:p-6 rounded-lg border border-border shadow-md transition-colors"
	>
		<!-- Name Input -->
		<div class="mb-6 text-left">
			<Label for="name" class="block mb-2 font-bold">Name:</Label>
			<Input id="name" type="text" bind:value={name} placeholder="Your Name" />
			{#if errors.name}
				<p class="text-destructive text-sm mt-2">{errors.name}</p>
			{/if}
		</div>

		<!-- Phone Number Input -->
		<div class="mb-6 text-left">
			<Label for="phone" class="block mb-2 font-bold">Phone Number:</Label>
			<Input id="phone" type="text" bind:value={phone} placeholder="Phone Number" />
			{#if errors.phone}
				<p class="text-destructive text-sm mt-2">{errors.phone}</p>
			{/if}
		</div>

		<!-- Login Email Input -->
		<div class="mb-6 text-left">
			<Label for="email" class="block mb-2 font-bold">Login Email:</Label>
			<Input id="email" type="email" bind:value={email} placeholder="Your Login Email" />
			{#if errors.email}
				<p class="text-destructive text-sm mt-2">{errors.email}</p>
			{/if}
		</div>

		<!-- Message Input -->
		<div class="mb-6 text-left">
			<Label for="message" class="block mb-2 font-bold">Message:</Label>
			<Textarea
				id="message"
				bind:value={message}
				placeholder="Your message here"
				class="min-h-[100px]"
			/>
			{#if errors.message}
				<p class="text-destructive text-sm mt-2">{errors.message}</p>
			{/if}
		</div>

		<!-- Submit Button -->
		<Button type="submit" class="w-full mt-4">Submit</Button>
	</form>
</main>
