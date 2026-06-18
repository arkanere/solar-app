<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import ChatBotBox from '$lib/in/components/ChatBotBox.svelte';
	import type { Writable } from 'svelte/store';

	const { messages, isVisible = $bindable(true) }: { messages?: Writable<unknown[]>; isVisible?: boolean } = $props();

	let isManuallyDismissed = $state(false);

	function handleOpenChange(open: boolean) {
		if (!open) {
			isManuallyDismissed = true;
		} else {
			isManuallyDismissed = false;
		}
	}

	function closePopup() {
		isManuallyDismissed = true;
	}

	$effect(() => {
		if (!isVisible) {
			isManuallyDismissed = false;
		}
	});
</script>

{#if isVisible && !isManuallyDismissed}
	<Dialog.Root open={!isManuallyDismissed} onOpenChange={handleOpenChange}>
		<Dialog.Overlay class="animate-fade-in" />
		<Dialog.Content
			showCloseButton={false}
			class="w-[90%] max-w-4xl h-[85vh] p-0 border-0 bg-transparent shadow-none overflow-hidden animate-slide-in-from-bottom"
		>
			<ChatBotBox {messages} onClose={closePopup} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
