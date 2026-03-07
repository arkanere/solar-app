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
				<div class="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
					{@html section.body}
				</div>
			</section>
		{/each}
	</div>
{/if}
