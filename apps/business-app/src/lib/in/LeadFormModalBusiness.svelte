<script>
	import { cn } from '$lib/utils';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	let {
		businessName = '',
		businessSlug = '',
		onLeadAdded = () => {}
	} = $props();

	let name = $state('');
	let phone = $state('');
	let pinCode = $state('');
	let comment = $state('');
	let email = $state('');

	// Placeholder text with line break
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

	// Set the urlParam dynamically based on the businessSlug
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
		if (!/^\d{6}$/.test(pinCode)) {
			errors.pinCode = 'Pin code must be exactly 6 digits';
			return false;
		} else {
			errors.pinCode = '';
			return true;
		}
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

	async function handleSubmit(event) {
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

					// Notify parent component
					onLeadAdded({
						name,
						phone,
						pinCode,
						comment,
						email
					});
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
	<!-- Success/Error Message -->
	{#if submitMessage}
		<div class={cn(
			"py-3 px-3 mb-4 rounded text-center font-bold",
			submitSuccess ? "bg-success-muted text-success border border-success/30" : "bg-destructive-muted text-destructive border border-destructive/30"
		)}>
			{submitMessage}
		</div>
	{/if}

	<!-- Name Input -->
	<div class="mb-4 max-[576px]:mb-3">
		<Label for="name" class="block mb-2 font-bold text-left">Name:</Label>
		<Input id="name" type="text" bind:value={name} required class="w-full" />
		{#if errors.name}
			<p class="text-destructive text-sm mt-1">{errors.name}</p>
		{/if}
	</div>

	<!-- Phone Number Input -->
	<div class="mb-4 max-[576px]:mb-3">
		<Label for="phone" class="block mb-2 font-bold text-left">Phone Number:</Label>
		<Input id="phone" type="text" bind:value={phone} required onblur={validatePhoneNumber} class="w-full" />
		{#if errors.phone}
			<p class="text-destructive text-sm mt-1">{errors.phone}</p>
		{/if}
	</div>

	<!-- Pin Code Input -->
	<div class="mb-4 max-[576px]:mb-3">
		<Label for="pinCode" class="block mb-2 font-bold text-left">Pin Code:</Label>
		<Input id="pinCode" type="text" bind:value={pinCode} required onblur={validatePinCode} class="w-full" />
		{#if errors.pinCode}
			<p class="text-destructive text-sm mt-1">{errors.pinCode}</p>
		{/if}
	</div>

	<!-- Email Input -->
	<div class="mb-4 max-[576px]:mb-3">
		<Label for="email" class="block mb-2 font-bold text-left">Email:</Label>
		<Input id="email" type="email" bind:value={email} required onblur={validateEmail} class="w-full" />
		{#if errors.email}
			<p class="text-destructive text-sm mt-1">{errors.email}</p>
		{/if}
	</div>

	<!-- Comment Input -->
	<div class="mb-4 max-[576px]:mb-3">
		<Label for="comment" class="block mb-2 font-bold text-left">Comment:</Label>
		<Textarea
			id="comment"
			bind:value={comment}
			placeholder={commentPlaceholder}
			required
			class="w-full h-[7.5em]"
		/>
		{#if errors.comment}
			<p class="text-destructive text-sm mt-1">{errors.comment}</p>
		{/if}
	</div>

	<!-- Submit Button -->
	<Button
		type="submit"
		disabled={isSubmitting}
		class="w-full bg-success hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 active:bg-success/80 text-success-foreground transition-colors"
	>
		{#if isSubmitting}Adding Lead...{/if}
		{#if !isSubmitting}Add Lead{/if}
	</Button>
</form>

<style>
	/* No component-specific styles needed - all styles are now in Tailwind */
</style>
