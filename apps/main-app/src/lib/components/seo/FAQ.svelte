<script lang="ts">
	let { items, title = 'Frequently Asked Questions' }: {
		items: { question: string; answer: string }[];
		title?: string;
	} = $props();
</script>

{#if items.length > 0}
	<section class="mb-8">
		<h2 class="text-2xl font-semibold text-primary mb-4">{title}</h2>
		<div class="space-y-4">
			{#each items as faq}
				<details class="border rounded-lg p-4 group">
					<summary class="font-medium cursor-pointer group-open:mb-2">{faq.question}</summary>
					<p class="text-muted-foreground text-sm">{faq.answer}</p>
				</details>
			{/each}
		</div>
	</section>
{/if}
