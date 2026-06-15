<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	export type ShowDeleteAccountProps = {
		show?: boolean;
		onClose?: () => void;
	};

	let { show = $bindable(false), onClose = () => {} }: ShowDeleteAccountProps = $props();

	let confirmText = $state('');
	let isDeleting = $state(false);

	// Clear the confirmation field whenever the dialog is opened.
	$effect(() => {
		if (show) confirmText = '';
	});

	function handleOpenChange(open: boolean) {
		if (!open) {
			show = false;
			onClose();
		}
	}

	const deleteAccount = async () => {
		if (confirmText !== 'DELETE') return;
		isDeleting = true;
		try {
			const response = await fetch(`/us/api/deleteAccount`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});

			const result = await response.json();
			if (result.success) {
				toast.success('Your account has been deleted.');
				show = false;
				onClose();
				await goto(`/us/login`);
			} else {
				throw new Error(result.error || 'Failed to delete account');
			}
		} catch (error) {
			console.error('Error deleting account:', error);
			toast.error('An error occurred while deleting your account');
		} finally {
			isDeleting = false;
		}
	};
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title class="text-destructive">Delete Account</Dialog.Title>
		</Dialog.Header>

		<Dialog.Description class="space-y-2 py-2">
			<p class="leading-relaxed">
				Deleting your account removes your business listing and any branches from the platform.
				This cannot be undone.
			</p>
		</Dialog.Description>

		<div class="flex flex-col gap-2">
			<Label for="delete-confirm" class="text-sm">
				Type <span class="font-bold">DELETE</span> to confirm:
			</Label>
			<Input id="delete-confirm" bind:value={confirmText} placeholder="DELETE" />
		</div>

		<Dialog.Footer class="mt-4">
			<Button
				variant="destructive"
				disabled={confirmText !== 'DELETE' || isDeleting}
				onclick={deleteAccount}
			>
				{isDeleting ? 'Deleting…' : 'Permanently delete'}
			</Button>
			<Button
				variant="outline"
				onclick={() => {
					show = false;
					onClose();
				}}
			>
				Cancel
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
