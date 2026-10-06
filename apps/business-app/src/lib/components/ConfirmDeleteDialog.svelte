<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	// Shared confirm step for every delete. The body is passed as children so
	// callers can bold the item name.
	let {
		open = $bindable(false),
		title,
		confirmLabel = 'Delete',
		loading = false,
		onConfirm,
		onCancel = () => {},
		children
	}: {
		open?: boolean;
		title: string;
		confirmLabel?: string;
		loading?: boolean;
		onConfirm: () => void;
		onCancel?: () => void;
		children: Snippet;
	} = $props();

	function cancel() {
		if (loading) return;
		open = false;
		onCancel();
	}

	function handleOpenChange(next: boolean) {
		if (!next) cancel();
	}
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{@render children()} This cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="gap-2 max-sm:flex-col">
			<Button variant="outline" onclick={cancel} disabled={loading} class="max-sm:w-full">
				Cancel
			</Button>
			<Button variant="destructive" onclick={onConfirm} disabled={loading} class="max-sm:w-full">
				{loading ? 'Deleting…' : confirmLabel}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
