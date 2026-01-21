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

<section style="display: flex; flex-direction: column; gap: var(--card-gap); padding-top: var(--card-gap); padding-bottom: var(--card-gap); padding-left: var(--container-padding); padding-right: var(--container-padding);" class="md:px-8">
	<div style="text-align: center; display: flex; flex-direction: column; gap: var(--form-element-field-gap);">
		<h2 style="font-size: var(--font-size-3xl); line-height: var(--font-size-3xl--line-height); font-weight: 600; letter-spacing: var(--tracking-heading); color: hsl(var(--primary));">
			Simplifying Solar For Everyone All over India
		</h2>
	</div>

	<div class="flex justify-center">
		<Card style="width: 100%; max-width: var(--max-width-4xl);">
			<CardContent style="padding-top: var(--card-padding-y);">
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
									<Table.Cell style="font-weight: 600;">{row.aspect}</Table.Cell>
									<Table.Cell>
										<Badge variant="default" style="gap: var(--form-element-field-gap);">
											<Check class="w-4 h-4" />
											{row.solar}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<Badge variant="destructive" style="gap: var(--form-element-field-gap);">
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
