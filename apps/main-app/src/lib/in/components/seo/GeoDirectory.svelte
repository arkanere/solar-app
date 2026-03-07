<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { MapPin } from '@lucide/svelte';

	interface GeoItem {
		name: string;
		slug: string;
		installerCount: number;
		href: string;
	}

	interface Props {
		items: GeoItem[];
		title?: string;
	}

	const { items, title }: Props = $props();
</script>

{#if items.length > 0}
	<section class="mb-8">
		{#if title}
			<h2 class="text-center text-primary text-3xl font-semibold mb-6">{title}</h2>
		{/if}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each items as item}
				<a href={item.href} class="group">
					<Card.Root class="h-full hover:shadow-md transition-shadow">
						<Card.Content class="flex items-center gap-3 p-4">
							<MapPin class="w-5 h-5 text-primary shrink-0" />
							<div class="min-w-0 flex-1">
								<h3 class="font-semibold text-primary group-hover:underline truncate">
									{item.name}
								</h3>
								<p class="text-sm text-muted-foreground">
									{item.installerCount} {item.installerCount === 1 ? 'installer' : 'installers'}
								</p>
							</div>
						</Card.Content>
					</Card.Root>
				</a>
			{/each}
		</div>
	</section>
{/if}
