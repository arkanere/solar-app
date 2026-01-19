<script lang="ts">
	import { Root as Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
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

<section class="space-y-6 py-12 px-4 md:px-8">
	<div class="text-center space-y-2">
		<h2 class="text-3xl md:text-4xl font-bold text-primary">
			Simplifying Solar For Everyone All over India
		</h2>
	</div>

	<div class="flex justify-center">
		<Card class="w-full max-w-4xl">
			<CardContent class="pt-6">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-1/4">Aspect</Table.Head>
								<Table.Head class="w-3/8">With <strong>Solar Vipani</strong></Table.Head>
								<Table.Head class="w-3/8">Traditional Approach</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each comparisonData as row (row.aspect)}
								<Table.Row>
									<Table.Cell class="font-semibold">{row.aspect}</Table.Cell>
									<Table.Cell>
										<Badge variant="default" class="gap-1">
											<Check class="w-4 h-4" />
											{row.solar}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<Badge variant="destructive" class="gap-1">
											<X class="w-4 h-4" />
											{row.traditional}
										</Badge>
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
