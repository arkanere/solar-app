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

<section class="flex flex-col gap-[theme(--card-gap)] px-[theme(--container-padding)] py-[theme(--card-gap)] md:px-8">
	<div class="flex flex-col items-center justify-center gap-[theme(--form-element-field-gap)] text-center">
		<h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
			Simplifying Solar For Everyone All over India
		</h2>
		<div class="flex justify-center items-center my-4">
			<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
		</div>
	</div>

	<div class="flex justify-center">
		<Card class="w-full max-w-4xl">
			<CardContent class="pt-[theme(--card-padding-y)]">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-1/4">Aspect</Table.Head>
								<Table.Head class="w-3/8 bg-green-50 dark:bg-green-900 text-green-900 dark:text-green-100">With <strong>Solar Vipani</strong></Table.Head>
								<Table.Head class="w-3/8 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">Traditional Approach</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each comparisonData as row (row.aspect)}
								<Table.Row>
									<Table.Cell class="font-semibold">{row.aspect}</Table.Cell>
									<Table.Cell class="bg-green-50 dark:bg-green-900">
										<div class="flex items-center gap-[theme(--form-element-field-gap)] text-green-700 dark:text-green-300">
											<Check class="w-4 h-4 flex-shrink-0" />
											<span>{row.solar}</span>
										</div>
									</Table.Cell>
									<Table.Cell class="bg-gray-50 dark:bg-gray-800">
										<div class="flex items-center gap-[theme(--form-element-field-gap)] text-gray-600 dark:text-gray-400">
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
