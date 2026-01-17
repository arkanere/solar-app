<script module lang="ts">
	export type AddReferrerProps = {
		show?: boolean;
		businessId: number;
		onClose?: () => void;
		onReferrerAdded?: (referrer: any) => void;
	};
</script>

<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { AlertCircle, CheckCircle2 } from '@lucide/svelte';

	let {
		show = $bindable(false),
		businessId,
		onClose = () => {},
		onReferrerAdded = () => {}
	}: AddReferrerProps = $props();

	// Form state
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
		if (isSubmitting) return;
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

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		// Validation
		if (!name || !slug || !phone) {
			errorMessage = 'Please enter name, slug, and phone number';
			return;
		}

		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
			errorMessage =
				'Slug must be lowercase alphanumeric characters and hyphens only (e.g., john-doe)';
			return;
		}

		if (!/^[6-9]\d{9}$/.test(phone)) {
			errorMessage = 'Please enter a valid 10-digit phone number';
			return;
		}

		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errorMessage = 'Please enter a valid email address';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/in/api/addReferrer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ businessId, name, slug, email, phone, notes })
			});

			const result = await response.json();

			if (result.success) {
				successMessage = 'Referrer added successfully!';
				resetForm();
				onReferrerAdded(result.referrer);

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
			<Dialog.Title>Add New Referrer</Dialog.Title>
		</Dialog.Header>

		{#if errorMessage}
			<Alert.Root variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<Alert.Description>{errorMessage}</Alert.Description>
			</Alert.Root>
		{/if}

		{#if successMessage}
			<Alert.Root class="border-green-200 bg-green-50 text-green-800">
				<CheckCircle2 class="h-4 w-4" />
				<Alert.Description>{successMessage}</Alert.Description>
			</Alert.Root>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="name">
					Name <span class="text-destructive">*</span>
				</Label>
				<Input
					type="text"
					id="name"
					bind:value={name}
					placeholder="Enter referrer name"
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="slug">
					Slug <span class="text-destructive">*</span>
				</Label>
				<Input
					type="text"
					id="slug"
					bind:value={slug}
					placeholder="e.g., john-doe or agent-123"
					pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
					required
				/>
				<p class="text-xs text-muted-foreground">
					Lowercase letters, numbers, and hyphens only. Used in referrer URL.
				</p>
			</div>

			<div class="space-y-2">
				<Label for="phone">
					Phone Number <span class="text-destructive">*</span>
				</Label>
				<Input
					type="tel"
					id="phone"
					bind:value={phone}
					placeholder="10-digit phone number"
					maxlength={10}
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input type="email" id="email" bind:value={email} placeholder="Email address" />
			</div>

			<div class="space-y-2">
				<Label for="notes">Notes</Label>
				<Textarea
					id="notes"
					bind:value={notes}
					placeholder="Add any notes about this referrer"
					rows={3}
				/>
			</div>

			<Dialog.Footer class="gap-2">
				<Button variant="outline" disabled={isSubmitting} onclick={close} type="button">
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Adding...' : 'Add Referrer'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
