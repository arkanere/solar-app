<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import LeadFormModal from './LeadFormModal.svelte';
	import { X } from '@lucide/svelte';

	let { isModalOpen = false, businessName = '', businessSlug = '', onClose = () => {} } = $props();
</script>

<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content class="max-w-[theme(--max-width-sm)] gap-[theme(--dialog-content-gap)]">
		<Dialog.Header class="gap-[theme(--dialog-header-gap)]">
			<Dialog.Title>Get Quotation</Dialog.Title>
			<Dialog.Close />
		</Dialog.Header>
		<div class="py-[theme(--dialog-content-padding)]">
			<LeadFormModal {businessName} {businessSlug} />
		</div>
	</Dialog.Content>
</Dialog.Root>
