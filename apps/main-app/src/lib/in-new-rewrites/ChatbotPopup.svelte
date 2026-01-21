<script lang="ts">
	import { Dialog } from '$lib/components/ui/dialog';
	import ChatBotBox from '$lib/in-new-rewrites/ChatBotBox.svelte';
	import type { Writable } from 'svelte/store';

	interface Props {
		messages?: Writable<unknown[]>;
		isVisible?: boolean;
	}

	const { messages, isVisible = $bindable(true) } = $props();

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
		<Dialog.Overlay
			style="animation: var(--animate-fade-in);"
		/>
		<Dialog.Content
			style="width: 90%; max-width: var(--max-width-4xl); max-height: 85vh; animation: var(--animation-enter-slow); border-radius: var(--dialog-content-radius);"
		>
			<ChatBotBox {messages} onClose={closePopup} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
