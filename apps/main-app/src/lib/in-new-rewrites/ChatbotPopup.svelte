<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import ChatBotBox from '$lib/in-new-rewrites/ChatBotBox.svelte';
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
			class="w-[theme(--dialog-max-width-responsive)] max-w-[theme(--max-width-4xl)] max-h-[theme(--dialog-max-height)] animate-slide-in-from-bottom"
		>
			<ChatBotBox {messages} onClose={closePopup} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
