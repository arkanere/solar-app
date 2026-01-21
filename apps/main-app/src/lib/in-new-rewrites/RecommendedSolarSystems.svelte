<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { RECOMMENDED_SYSTEMS } from '$lib/constants/solarSystems';
</script>

<section
	style="padding-top: var(--card-gap); padding-bottom: var(--card-gap); padding-left: 1rem; padding-right: 1rem;"
	class="sm:px-6 lg:px-8"
>
	<div class="max-w-4xl mx-auto">
		<h2
			class="text-center text-primary"
			style="font-size: var(--font-size-3xl); line-height: var(--font-size-3xl--line-height); font-weight: 600; margin-bottom: var(--card-gap);"
		>
			Recommended Solar Systems for Homes
		</h2>

		<Card.Root class="border-0" style="box-shadow: var(--shadow-card);">
			<Card.Content class="p-0">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row class="bg-primary">
								<Table.Head
									class="text-primary-foreground uppercase"
									style="font-weight: 600; font-size: var(--font-size-sm); letter-spacing: var(--tracking-wider);"
								>
									Monthly Consumption / Bill
								</Table.Head>
								<Table.Head
									class="text-primary-foreground uppercase"
									style="font-weight: 600; font-size: var(--font-size-sm); letter-spacing: var(--tracking-wider);"
								>
									Power Outage
								</Table.Head>
								<Table.Head
									class="text-primary-foreground uppercase"
									style="font-weight: 600; font-size: var(--font-size-sm); letter-spacing: var(--tracking-wider);"
								>
									Recommended Solar System
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each RECOMMENDED_SYSTEMS as row, idx}
								<Table.Row class={idx % 2 === 0 ? 'bg-muted' : ''}>
									<Table.Cell style="font-weight: 500;">{row.consumption}</Table.Cell>
									<Table.Cell>{row.outage}</Table.Cell>
									<Table.Cell>
										<div class="text-primary" style="font-weight: 600;">{row.system}</div>
										{#if row.note}
											<div
												class="text-foreground-secondary"
												style="font-size: var(--font-size-sm); line-height: var(--font-size-sm--line-height); margin-top: var(--form-element-field-gap);"
											>
												({row.note})
											</div>
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
