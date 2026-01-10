<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	export type ShowSupportProps = {
		show?: boolean;
		onClose?: () => void;
	};

	let { show = $bindable(false), onClose = () => {} }: ShowSupportProps = $props();

	function handleOpenChange(open: boolean) {
		if (!open) {
			show = false;
			onClose();
		}
	}

	function close() {
		show = false;
		onClose();
	}
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[500px]">
		<Dialog.Header class="text-center sm:text-center">
			<Dialog.Title>Support</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-2.5 text-center py-4">
			<p class="leading-relaxed text-foreground">
				<a href="mailto:admin@solarvipani.com" class="text-accent no-underline hover:underline"
					>admin@solarvipani.com</a
				><br />
				or call us at
				<a href="tel:+918983066701" class="text-accent no-underline hover:underline"
					>+91 8983066701</a
				>
			</p>
		</div>

		<Dialog.Footer class="sm:justify-center">
			<Button variant="outline" onclick={close}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
