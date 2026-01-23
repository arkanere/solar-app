<script lang="ts">
	import { Root as Card, CardContent } from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Check, X } from '@lucide/svelte';

	const comparisonData = [
		{
			aspect: 'Finding Installers',
			solar: 'Verified local installers',
			traditional: 'Unverified, hard to find'
		},
		{
			aspect: 'Getting Quotes',
			solar: 'Quick multiple quotations',
			traditional: 'Slow, limited options'
		},
		{
			aspect: 'Information',
			solar: 'Credible & transparent',
			traditional: 'Scattered & unreliable'
		},
		{
			aspect: 'Multiple Brands',
			solar: 'Compare many brands in one place',
			traditional: "Limited to installer's choice"
		},
		{
			aspect: 'Process',
			solar: 'Hassle-free & guided',
			traditional: 'Time-consuming & confusing'
		}
	];
</script>

<section class="flex flex-col gap-[theme(--spacing-component-between)] px-[theme(--container-padding)] py-[theme(--spacing-component-between)] md:px-[theme(--container-padding-md)]">
	<div class="flex flex-col items-center justify-center gap-[theme(--form-element-field-gap)] text-center">
		<h2 class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-component-internal)]">
			Simplifying Solar For Everyone All over India
		</h2>
	</div>

	<div class="flex justify-center">
		<Card class="w-full max-w-[theme(--max-width-4xl)]">
			<CardContent>
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-1/4">Aspect</Table.Head>
								<Table.Head class="w-3/8 bg-secondary text-foreground">With <strong>Solar Vipani</strong></Table.Head>
								<Table.Head class="w-3/8 bg-secondary text-foreground-secondary">Traditional Approach</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each comparisonData as row (row.aspect)}
								<Table.Row>
									<Table.Cell class="font-semibold">{row.aspect}</Table.Cell>
									<Table.Cell class="bg-secondary">
										<div class="flex items-center gap-[theme(--form-element-field-gap)] text-foreground">
											<Check class="w-4 h-4 flex-shrink-0" />
											<span>{row.solar}</span>
										</div>
									</Table.Cell>
									<Table.Cell class="bg-secondary">
										<div class="flex items-center gap-[theme(--form-element-field-gap)] text-foreground-secondary">
											<X class="w-4 h-4 flex-shrink-0" />
											<span>{row.traditional}</span>
										</div>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</CardContent>
		</Card>
	</div>
</section>
