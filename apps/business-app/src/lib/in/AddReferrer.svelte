<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	export type AddReferrerProps = {
		show?: boolean;
		businessId: number;
		onClose?: () => void;
		onReferrerAdded?: () => void;
	};

	let {
		show = $bindable(false),
		businessId,
		onClose = () => {},
		onReferrerAdded = () => {}
	}: AddReferrerProps = $props();

	// Form fields
	let name = $state('');
	let slug = $state('');
	let email = $state('');
	let phone = $state('');
	let notes = $state('');
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	function handleOpenChange(open: boolean) {
		if (!open) {
			resetForm();
			onClose();
		}
	}

	function close() {
		if (isSubmitting) return; // Prevent closing during submission
		show = false;
		onClose();
	}

	function resetForm() {
		name = '';
		slug = '';
		email = '';
		phone = '';
		notes = '';
		errorMessage = '';
		successMessage = '';
	}

	// Handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (!name || !slug || !phone) {
			errorMessage = 'Please enter name, slug, and phone number';
			return;
		}

		// Validate slug format (alphanumeric and hyphens only)
		const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		if (!slugRegex.test(slug)) {
			errorMessage =
				'Slug must be lowercase alphanumeric characters and hyphens only (e.g., john-doe)';
			return;
		}

		// Validate phone number (basic validation)
		const phoneRegex = /^[6-9]\d{9}$/;
		if (!phoneRegex.test(phone)) {
			errorMessage = 'Please enter a valid 10-digit phone number';
			return;
		}

		// Validate email if provided
		if (email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				errorMessage = 'Please enter a valid email address';
				return;
			}
		}

		isSubmitting = true;

		try {
			const response = await fetch('/in/api/addReferrer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					businessId,
					name,
					slug,
					email,
					phone,
					notes
				})
			});

			const result = await response.json();

			if (result.success) {
				successMessage = 'Referrer added successfully!';
				// Reset form
				resetForm();

				// Notify parent component
				onReferrerAdded(result.referrer);

				// Close modal after short delay
				setTimeout(() => {
					show = false;
					onClose();
					window.location.reload();
				}, 1500);
			} else {
				errorMessage = result.error || 'Failed to add referrer';
			}
		} catch (error) {
			console.error('Error adding referrer:', error);
			errorMessage = 'An error occurred while adding the referrer';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[500px] max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="text-accent">Add New Referrer</Dialog.Title>
		</Dialog.Header>

		{#if errorMessage}
			<div class="text-destructive mb-4 p-3 bg-destructive-muted rounded text-sm">
				{errorMessage}
			</div>
		{/if}

		{#if successMessage}
			<div class="text-success mb-4 p-3 bg-success-muted rounded text-sm">{successMessage}</div>
		{/if}

		<form onsubmit={handleSubmit}>
			<!-- Name Field -->
			<div class="mb-4">
				<Label for="name" class="block mb-2 font-semibold">
					Name <span class="text-destructive">*</span>
				</Label>
				<Input
					type="text"
					id="name"
					bind:value={name}
					placeholder="Enter referrer name"
					required
					class="w-full"
				/>
			</div>

			<!-- Slug Field -->
			<div class="mb-4">
				<Label for="slug" class="block mb-2 font-semibold">
					Slug <span class="text-destructive">*</span>
				</Label>
				<Input
					type="text"
					id="slug"
					bind:value={slug}
					placeholder="e.g., john-doe or agent-123"
					pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
					required
					class="w-full"
				/>
				<small class="block mt-1 text-xs text-muted-foreground italic"
					>Lowercase letters, numbers, and hyphens only. This will be used in the referrer URL.</small
				>
			</div>

			<!-- Phone Field -->
			<div class="mb-4">
				<Label for="phone" class="block mb-2 font-semibold">
					Phone Number <span class="text-destructive">*</span>
				</Label>
				<Input
					type="tel"
					id="phone"
					bind:value={phone}
					placeholder="Enter 10-digit phone number"
					maxlength="10"
					required
					class="w-full"
				/>
			</div>

			<!-- Email Field -->
			<div class="mb-4">
				<Label for="email" class="block mb-2 font-semibold">Email</Label>
				<Input
					type="email"
					id="email"
					bind:value={email}
					placeholder="Enter email address"
					class="w-full"
				/>
			</div>

			<!-- Notes Field -->
			<div class="mb-4">
				<Label for="notes" class="block mb-2 font-semibold">Notes</Label>
				<Textarea
					id="notes"
					bind:value={notes}
					placeholder="Add any notes about this referrer"
					rows={3}
					class="w-full"
				/>
			</div>

			<Dialog.Footer class="max-sm:flex-col">
				<Button variant="secondary" disabled={isSubmitting} onclick={close} class="max-sm:w-full">
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting} class="max-sm:w-full">
					{isSubmitting ? 'Adding...' : 'Add Referrer'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
