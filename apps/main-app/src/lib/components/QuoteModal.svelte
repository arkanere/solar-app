<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import LeadFormModal from './LeadFormModal.svelte';

	let { isModalOpen = false, businessName = '', businessSlug = '' } = $props();
</script>

<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content class="max-w-sm gap-4">
		<Dialog.Header class="gap-2">
			<Dialog.Title>Get Quotation</Dialog.Title>
			<Dialog.Close />
		</Dialog.Header>
		<div class="py-6">
			<LeadFormModal {businessName} {businessSlug} />
		</div>
	</Dialog.Content>
</Dialog.Root>
