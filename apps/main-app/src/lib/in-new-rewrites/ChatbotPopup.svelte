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
		<Dialog.Overlay class="animate-in fade-in duration-300" />
		<Dialog.Content
			class="w-[90%] max-w-[900px] max-h-[85vh] animate-in slide-in-from-bottom-10 duration-400 md:max-w-[900px] sm:max-w-[95%] sm:max-h-[90vh] mobile:w-full mobile:max-h-screen mobile:rounded-none"
		>
			<ChatBotBox {messages} onClose={closePopup} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
