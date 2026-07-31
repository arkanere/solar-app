<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Download } from '@lucide/svelte';
	import { RECOMMENDED_SYSTEMS } from '$lib/constants/solarSystems';
	import { parseKw } from '$lib/in/sampleQuotation';

	interface Props {
		city?: string;
		pageUrl?: string;
	}

	const { city, pageUrl }: Props = $props();

	let downloadingSystem = $state<string | null>(null);

	async function downloadSample(systemLabel: string) {
		const kw = parseKw(systemLabel);
		if (kw <= 0 || downloadingSystem !== null) return;
		downloadingSystem = systemLabel;
		try {
			const systemType = /hybrid/i.test(systemLabel) ? 'Hybrid' : 'On-Grid';
			const { generateSampleQuotationPdf } = await import('$lib/in/sampleQuotationPdf');
			await generateSampleQuotationPdf({ kw, systemType, city, pageUrl });
		} catch (e) {
			console.error('Failed to generate sample quotation', e);
		} finally {
			downloadingSystem = null;
		}
	}
</script>

<section class="py-[theme(--card-gap)] px-[theme(--container-padding)] sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<h2 class="text-center text-primary text-3xl font-semibold mb-[theme(--card-gap)] leading-9">
			Recommended Solar Systems for Homes
		</h2>

		<Card.Root class="border-0 shadow-[theme(--shadow-card)]">
			<Card.Content class="p-0">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row class="bg-primary">
								<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">
									Monthly Consumption / Bill
								</Table.Head>
								<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">
									Power Outage
								</Table.Head>
								<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">
									Recommended Solar System
								</Table.Head>
								<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">
									Sample Quote
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each RECOMMENDED_SYSTEMS as row, idx}
								<Table.Row class={idx % 2 === 0 ? 'bg-muted' : ''}>
									<Table.Cell class="font-medium">{row.consumption}</Table.Cell>
									<Table.Cell>{row.outage}</Table.Cell>
									<Table.Cell>
										<div class="text-primary font-semibold">{row.system}</div>
										{#if row.note}
											<div class="text-foreground-secondary text-sm leading-5 mt-[theme(--form-element-field-gap)]">
												({row.note})
											</div>
										{/if}
									</Table.Cell>
									<Table.Cell>
										<Button
											variant="outline"
											size="sm"
											class="whitespace-nowrap"
											disabled={downloadingSystem !== null}
											onclick={() => downloadSample(row.system)}
										>
											<Download size={14} />
											{downloadingSystem === row.system ? 'Preparing…' : 'Sample PDF'}
										</Button>
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
