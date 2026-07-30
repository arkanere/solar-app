<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import ChatBotBox from './ChatBotBox.svelte';
	import type { Writable } from 'svelte/store';

	// Open state lives in the layout, which is the only place that knows about
	// both triggers (launcher click and scroll depth). This component is mounted
	// only while the chat is open, so it just reports dismissals upward.
	const { messages, onClose }: { messages?: Writable<unknown[]>; onClose: () => void } = $props();

	function handleOpenChange(open: boolean) {
		if (!open) onClose();
	}
</script>

<Dialog.Root open={true} onOpenChange={handleOpenChange}>
	<Dialog.Overlay class="animate-fade-in" />
	<Dialog.Content
		showCloseButton={false}
		class="w-[90%] max-w-4xl h-[85vh] p-0 border-0 bg-transparent shadow-none overflow-hidden animate-slide-in-from-bottom"
	>
		<ChatBotBox {messages} {onClose} />
	</Dialog.Content>
</Dialog.Root>
