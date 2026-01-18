<script lang="ts">
	import { isDarkMode } from '$lib/themeStore.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { RECOMMENDED_SYSTEMS } from '$lib/constants/solarSystems';

	let darkMode = $derived($isDarkMode);
</script>

<section class="py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<h2 class="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
			Recommended Solar Systems for Homes
		</h2>

		<Card.Root class="border-0 shadow-md dark:shadow-lg">
			<Card.Content class="p-0">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row class="bg-blue-600 dark:bg-blue-900">
								<Table.Head class="text-white dark:text-white font-semibold uppercase text-sm tracking-wider">
									Monthly Consumption / Bill
								</Table.Head>
								<Table.Head class="text-white dark:text-white font-semibold uppercase text-sm tracking-wider">
									Power Outage
								</Table.Head>
								<Table.Head class="text-white dark:text-white font-semibold uppercase text-sm tracking-wider">
									Recommended Solar System
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each RECOMMENDED_SYSTEMS as row, idx}
								<Table.Row class={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''}>
									<Table.Cell class="font-medium">{row.consumption}</Table.Cell>
									<Table.Cell>{row.outage}</Table.Cell>
									<Table.Cell>
										<div class="font-semibold text-blue-600 dark:text-blue-400">{row.system}</div>
										{#if row.note}
											<div class="text-sm text-gray-600 dark:text-gray-400 mt-1">({row.note})</div>
										{/if}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</section>
