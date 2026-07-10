<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	let {
		open = $bindable(false),
		summary = '',
		isAccepting = false,
		agreeLabel = 'I Agree — Claim this Lead',
		onAgree = () => {}
	}: {
		open?: boolean;
		summary?: string;
		isAccepting?: boolean;
		agreeLabel?: string;
		onAgree?: () => void;
	} = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[480px]">
		<Dialog.Header>
			<Dialog.Title>Data Handling Agreement</Dialog.Title>
			<Dialog.Description>
				Before claiming customer leads, please review and accept how their personal
				data must be handled. This acceptance is required every 90 days.
			</Dialog.Description>
		</Dialog.Header>

		<p class="m-0 leading-relaxed text-foreground text-sm">{summary}</p>

		<Dialog.Footer>
			<Button class="w-full" onclick={onAgree} disabled={isAccepting}>
				{isAccepting ? 'Saving…' : agreeLabel}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
