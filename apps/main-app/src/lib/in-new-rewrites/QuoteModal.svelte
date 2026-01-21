<script lang="ts">
	import LeadFormModal from './LeadFormModal.svelte';

	let { isModalOpen = false, businessName = '', businessSlug = '', onClose = () => {} } = $props();
</script>

{#if isModalOpen}
	<div class="fixed inset-0 overlay-dark flex items-center justify-center z-50" role="button" tabindex="0" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()}>
		<div class="bg-card w-full" style="max-width: var(--max-width-sm); margin-left: var(--space-y-4); margin-right: var(--space-y-4); box-shadow: var(--shadow-lg); border-radius: var(--radius-lg);" role="presentation" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
			<div class="flex justify-between items-center border-b border-border" style="padding: 1.5rem;">
				<h2 style="font-size: var(--font-size-2xl); line-height: var(--font-size-2xl--line-height); font-weight: 700;">Get Quotation</h2>
				<button
					class="text-muted-foreground hover:text-foreground"
					onclick={onClose}
				>
					✕
				</button>
			</div>
			<div style="padding: 1.5rem;">
				<LeadFormModal {businessName} {businessSlug} />
			</div>
		</div>
	</div>
{/if}
