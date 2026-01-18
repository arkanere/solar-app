<script lang="ts">
	import LeadFormModal from './LeadFormModal.svelte';

	let { isModalOpen = false, businessName = '', businessSlug = '', onClose = () => {} } = $props();
</script>

{#if isModalOpen}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="button" tabindex="0" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()}>
		<div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-4" role="presentation" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
			<div class="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
				<h2 class="text-2xl font-bold">Get Quotation</h2>
				<button
					class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
					onclick={onClose}
				>
					✕
				</button>
			</div>
			<div class="p-6">
				<LeadFormModal {businessName} {businessSlug} />
			</div>
		</div>
	</div>
{/if}
