<script lang="ts">
	let { sections }: {
		sections: { heading: string; body: string }[];
	} = $props();
</script>

{#if sections.length > 0}
	<div class="space-y-8 mb-8">
		{#each sections as section}
			<section>
				<h2 class="text-2xl font-semibold text-primary mb-3">{section.heading}</h2>
				<div class="content-body text-muted-foreground leading-relaxed prose prose-sm max-w-none">
					{@html section.body}
				</div>
			</section>
		{/each}
	</div>
{/if}

<style>
	/* Tables arrive as raw HTML via {@html}; the `prose` classes are inert
	   (no typography plugin installed), so style them here. */
	.content-body :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
		font-size: 0.875rem;
	}

	.content-body :global(th),
	.content-body :global(td) {
		border: 1px solid hsl(var(--border));
		padding: 0.5rem 0.75rem;
		text-align: left;
	}

	.content-body :global(th) {
		background-color: hsl(var(--muted));
		color: hsl(var(--foreground));
		font-weight: 600;
	}

	.content-body :global(tbody tr:nth-child(even)) {
		background-color: hsl(var(--muted) / 0.4);
	}
</style>
