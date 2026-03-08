<script lang="ts">
	import { Quote } from '@lucide/svelte';

	interface Testimonial {
		name: string;
		business: string;
		district: string;
		text: string;
	}

	interface Props {
		testimonials: Testimonial[];
	}

	let { testimonials } = $props();
</script>

{#if testimonials.length > 0}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each testimonials as t}
			<div class="flex flex-col gap-3 rounded-lg border bg-card p-5">
				<Quote class="h-5 w-5 text-primary/40" />
				<p class="text-sm text-foreground">{t.text}</p>
				<div class="mt-auto border-t pt-3">
					<p class="text-sm font-semibold text-foreground">{t.name}</p>
					<p class="text-xs text-muted-foreground">{t.business}, {t.district}</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
