<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		city: string;
		onGetQuote: () => void;
	}

	const { city, onGetQuote }: Props = $props();

	const subsidyRows = [
		{ size: '1 kW', grossCost: '₹65,000 – ₹80,000', centralSubsidy: '₹30,000', netCost: '₹35,000 – ₹50,000', annualSavings: '~₹7,000' },
		{ size: '2 kW', grossCost: '₹1,30,000 – ₹1,60,000', centralSubsidy: '₹60,000', netCost: '₹70,000 – ₹1,00,000', annualSavings: '~₹14,000' },
		{ size: '3 kW', grossCost: '₹1,80,000 – ₹2,20,000', centralSubsidy: '₹78,000', netCost: '₹1,02,000 – ₹1,42,000', annualSavings: '~₹21,000' },
		{ size: '5 kW', grossCost: '₹2,80,000 – ₹3,50,000', centralSubsidy: '₹78,000', netCost: '₹2,02,000 – ₹2,72,000', annualSavings: '~₹35,000' },
		{ size: '10 kW', grossCost: '₹5,50,000 – ₹7,00,000', centralSubsidy: '₹78,000', netCost: '₹4,72,000 – ₹6,22,000', annualSavings: '~₹70,000' },
	];
</script>

<section id="subsidy-section" class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)]">
	<div class="text-center mb-8">
		<h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
			Solar Subsidy in {city} — PM Surya Ghar Yojana
		</h2>
		<div class="flex justify-center items-center my-4">
			<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
		</div>
		<p class="text-foreground dark:text-foreground-secondary max-w-2xl mx-auto text-base leading-relaxed">
			The central government's <strong>PM Surya Ghar Yojana</strong> provides direct subsidies for residential rooftop solar installations. The subsidy is credited directly to your bank account after installation and grid connection.
		</p>
	</div>

	<Card.Root class="border-0 shadow-[theme(--shadow-card)] mb-8">
		<Card.Content class="p-0">
			<div class="overflow-x-auto">
				<Table.Root>
					<Table.Header>
						<Table.Row class="bg-primary">
							<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">System Size</Table.Head>
							<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">Gross Cost</Table.Head>
							<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">Central Subsidy</Table.Head>
							<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">Net Cost After Subsidy</Table.Head>
							<Table.Head class="text-primary-foreground uppercase font-semibold text-sm tracking-wider">Est. Annual Savings</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each subsidyRows as row, idx}
							<Table.Row class={idx % 2 === 0 ? 'bg-muted' : ''}>
								<Table.Cell class="font-semibold text-primary">{row.size}</Table.Cell>
								<Table.Cell>{row.grossCost}</Table.Cell>
								<Table.Cell class="font-semibold text-success">{row.centralSubsidy}</Table.Cell>
								<Table.Cell class="font-semibold">{row.netCost}</Table.Cell>
								<Table.Cell class="text-foreground-secondary text-sm">{row.annualSavings}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-[theme(--card-gap)] mb-8">
		<div class="rounded-[theme(--radius-md)] bg-[hsl(var(--accent)/0.1)] p-4">
			<strong class="block text-base font-semibold text-primary mb-2">How the Subsidy Works</strong>
			<ul class="text-sm text-foreground dark:text-foreground-secondary space-y-1 list-disc list-inside leading-relaxed">
				<li>Subsidy is ₹30,000/kW for first 2 kW</li>
				<li>Additional ₹18,000 for capacity between 2–3 kW</li>
				<li>Maximum central subsidy is capped at ₹78,000</li>
				<li>Subsidy is credited directly to your bank account</li>
				<li>Installer must be DISCOM-empanelled to avail subsidy</li>
			</ul>
		</div>
		<div class="rounded-[theme(--radius-md)] bg-[hsl(var(--accent)/0.1)] p-4">
			<strong class="block text-base font-semibold text-primary mb-2">Steps to Get the Subsidy</strong>
			<ol class="text-sm text-foreground dark:text-foreground-secondary space-y-1 list-decimal list-inside leading-relaxed">
				<li>Register at <strong>pmsuryaghar.gov.in</strong></li>
				<li>Get feasibility approval from your DISCOM</li>
				<li>Install via a DISCOM-empanelled installer</li>
				<li>Submit documents: installation report + net meter application</li>
				<li>Subsidy credited within 30 days of inspection</li>
			</ol>
		</div>
	</div>

	<p class="text-xs text-muted-foreground text-center mb-8">
		* Costs are indicative estimates for {city} region. Final pricing depends on roof type, panel brand, inverter, and installation complexity. Annual savings based on ₹7/unit average tariff.
	</p>

	<div class="text-center">
		<Button
			class="font-semibold text-sm md:text-lg px-4 md:px-10 py-3 md:py-4 uppercase tracking-wide max-w-full whitespace-normal"
			onclick={onGetQuote}
		>
			Check Subsidy Eligibility — Get Free Quote
		</Button>
	</div>
</section>
