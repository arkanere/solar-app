<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	export type ShowSupportProps = {
		show?: boolean;
		onClose?: () => void;
	};

	let { show = $bindable(false), onClose = () => {} }: ShowSupportProps = $props();
</script>

<Dialog.Root bind:open={show} onOpenChange={() => onClose()}>
	<Dialog.Content class="max-w-[500px]">
		<Dialog.Header class="text-center sm:text-center">
			<Dialog.Title>Support</Dialog.Title>
		</Dialog.Header>

		<Dialog.Description class="text-center py-4">
			<p class="leading-relaxed">
				<a href="mailto:admin@solarvipani.com" class="text-accent no-underline hover:underline">
					admin@solarvipani.com
				</a>
			</p>
		</Dialog.Description>

		<Dialog.Footer class="sm:justify-center">
			<Button variant="outline" onclick={() => (show = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
