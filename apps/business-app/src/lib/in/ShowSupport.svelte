<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	let {
		show = $bindable(false),
		onClose = () => {}
	} = $props();

	function handleOpenChange(open) {
		if (!open) {
			show = false;
			onClose();
		}
	}
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[500px]">
		<Dialog.Header class="text-center sm:text-center">
			<Dialog.Title>Support</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-2.5 text-center py-4">
			<p class="leading-relaxed text-foreground">
				<a href="mailto:admin@solarvipani.com" class="text-accent no-underline hover:underline">admin@solarvipani.com</a><br />
				or call us at <a href="tel:+918983066701" class="text-accent no-underline hover:underline">+91 8983066701</a>
			</p>
		</div>

		<Dialog.Footer class="sm:justify-center">
			<Dialog.Close asChild let:builder>
				<Button builders={[builder]} variant="outline">Close</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
