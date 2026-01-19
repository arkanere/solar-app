<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { RECOMMENDED_SYSTEMS } from '$lib/constants/solarSystems';
</script>

<section class="py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<h2 class="text-3xl font-bold text-center mb-8 text-primary">
			Recommended Solar Systems for Homes
		</h2>

		<Card.Root class="border-0 shadow-md dark:shadow-lg">
			<Card.Content class="p-0">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row class="bg-primary">
								<Table.Head class="text-primary-foreground font-semibold uppercase text-sm tracking-wider">
									Monthly Consumption / Bill
								</Table.Head>
								<Table.Head class="text-primary-foreground font-semibold uppercase text-sm tracking-wider">
									Power Outage
								</Table.Head>
								<Table.Head class="text-primary-foreground font-semibold uppercase text-sm tracking-wider">
									Recommended Solar System
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each RECOMMENDED_SYSTEMS as row, idx}
								<Table.Row class={idx % 2 === 0 ? 'bg-muted' : ''}>
									<Table.Cell class="font-medium">{row.consumption}</Table.Cell>
									<Table.Cell>{row.outage}</Table.Cell>
									<Table.Cell>
										<div class="font-semibold text-primary">{row.system}</div>
										{#if row.note}
											<div class="text-sm text-foreground-secondary mt-1">({row.note})</div>
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
