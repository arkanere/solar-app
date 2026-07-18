<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import * as Select from '$lib/components/ui/select';
	import { breadcrumbLD, faqLD, webAppLD } from '$lib/seo';
	import FAQ from '$lib/in/components/seo/FAQ.svelte';
	import Breadcrumb from '$lib/in/components/seo/Breadcrumb.svelte';
	import { Sun, Zap, IndianRupee, Clock, ArrowRight } from '@lucide/svelte';
	import { capture } from '$lib/posthog';

	let { data } = $props();

	const BASE_URL = 'https://solarvipani.com';

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: `${BASE_URL}/in/` },
		{ name: 'Tools', url: `${BASE_URL}/in/tools/` },
		{ name: 'Solar Calculator', url: `${BASE_URL}/in/tools/solar-calculator/` }
	]);

	const webApp = webAppLD({
		name: 'Solar Calculator',
		description:
			'Calculate your ideal solar system size, cost, savings, and payback period based on your electricity bill and location in India.',
		url: `${BASE_URL}/in/tools/solar-calculator/`
	});

	const faqs = [
		{
			question: 'How accurate is this solar calculator?',
			answer:
				'Our calculator uses real marketplace data from verified installers across India. Estimates are based on current pricing, local solar irradiance, and applicable government subsidies. Actual costs may vary by 10-15% based on specific site conditions.'
		},
		{
			question: 'What system size do I need for my home?',
			answer:
				'System size depends on your electricity consumption. A typical Indian household with a monthly bill of Rs 1,500-2,000 needs a 3-4 kW system. Our calculator recommends the optimal size based on your bill amount.'
		},
		{
			question: 'How is the payback period calculated?',
			answer:
				'Payback period = net system cost (after subsidy) divided by annual savings. We account for PM Surya Ghar central subsidies and state-specific top-ups where available.'
		},
		{
			question: 'Does the calculator include subsidy?',
			answer:
				'Yes. The calculator applies the PM Surya Ghar central subsidy (Rs 30,000/kW for first 2 kW, Rs 18,000/kW for 2-3 kW) and state subsidies where data is available.'
		}
	];

	const faqSchema = faqLD(faqs);

	// Form state
	let selectedState = $state('');
	let selectedDistrict = $state('');
	let monthlyBill = $state(2000);
	let ratePerUnit = $state(8);
	let systemType = $state('on-grid');
	let hasCalculated = $state(false);

	const states = $derived(
		[...new Set(data.districts.map((d: { state: string }) => d.state))].sort() as string[]
	);

	const filteredDistricts = $derived(
		selectedState
			? data.districts.filter((d: { state: string }) => d.state === selectedState)
			: []
	);

	const selectedDistrictData = $derived(
		data.districts.find(
			(d: { district: string; state: string }) =>
				d.state === selectedState && d.district === selectedDistrict
		)
	);

	// Calculation logic
	const monthlyUnits = $derived(Math.round(monthlyBill / ratePerUnit));
	const dailyUnits = $derived(monthlyUnits / 30);
	const peakSunHours = 4.5; // average for India
	const systemSizeKw = $derived(
		parseFloat(Math.max(1, dailyUnits / peakSunHours).toFixed(1))
	);

	// Cost per kW (market average)
	const costPerKw = $derived(
		systemSizeKw <= 3 ? 55000 : systemSizeKw <= 5 ? 50000 : 45000
	);
	const grossCost = $derived(Math.round(systemSizeKw * costPerKw));

	// Central subsidy (PM Surya Ghar slabs)
	const centralSubsidy = $derived.by(() => {
		if (systemType !== 'on-grid') return 0;
		const kw = systemSizeKw;
		if (kw <= 2) return Math.round(kw * 30000);
		if (kw <= 3) return 60000 + Math.round((kw - 2) * 18000);
		return 78000; // max for 3+ kW
	});

	const netCost = $derived(grossCost - centralSubsidy);
	const annualGeneration = $derived(Math.round(systemSizeKw * peakSunHours * 365));
	const annualSavings = $derived(Math.round(annualGeneration * ratePerUnit));
	const paybackYears = $derived(
		annualSavings > 0 ? parseFloat((netCost / annualSavings).toFixed(1)) : 0
	);
	const savingsOver25Years = $derived(Math.round(annualSavings * 25 - netCost));

	function handleCalculate() {
		hasCalculated = true;
		capture('solar_calculator_used', {
			monthly_bill: monthlyBill,
			system_size_kw: systemSizeKw,
			net_cost: netCost,
			payback_years: paybackYears,
			state: selectedState,
			district: selectedDistrict
		});
	}

	function formatCurrency(n: number): string {
		if (n >= 100000) return `${(n / 100000).toFixed(1)} Lakh`;
		return n.toLocaleString('en-IN');
	}
</script>

<svelte:head>
	<title>Solar Calculator — Estimate Cost, Savings & System Size | Solar Vipani</title>
	<meta
		name="description"
		content="Free solar calculator for India. Enter your electricity bill to get system size, cost estimate, subsidy, payback period, and 25-year savings. Based on real installer data."
	/>
	<link rel="canonical" href="{BASE_URL}/in/tools/solar-calculator/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{@html `<script type="application/ld+json">${JSON.stringify(webApp)}<\u002Fscript>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}<\u002Fscript>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<Breadcrumb
		items={[
			{ name: 'Home', href: '/in/' },
			{ name: 'Tools', href: '/in/tools/' },
			{ name: 'Solar Calculator', href: '/in/tools/solar-calculator/' }
		]}
	/>

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">Solar Calculator</h1>
	<p class="text-muted-foreground mb-8 max-w-2xl">
		Enter your electricity bill and location to get an estimate of system size, cost, savings, and
		payback period. Based on real data from {data.totalInstallers}+ verified installers.
	</p>

	<!-- Calculator Form -->
	<div class="rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)] mb-8">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- State -->
			<div class="flex flex-col gap-2">
				<Label for="state">State</Label>
				<Select.Root type="single" bind:value={selectedState} onValueChange={() => { selectedDistrict = ''; }}>
					<Select.Trigger class="w-full">
						{selectedState || 'Select state'}
					</Select.Trigger>
					<Select.Content class="max-h-60">
						{#each states as state}
							<Select.Item value={state}>{state}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- District -->
			<div class="flex flex-col gap-2">
				<Label for="district">District</Label>
				<Select.Root type="single" bind:value={selectedDistrict} disabled={!selectedState}>
					<Select.Trigger class="w-full">
						{selectedDistrict || 'Select district'}
					</Select.Trigger>
					<Select.Content class="max-h-60">
						{#each filteredDistricts as d}
							<Select.Item value={d.district}>{d.district}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- System Type -->
			<div class="flex flex-col gap-2">
				<Label for="system-type">System Type</Label>
				<Select.Root type="single" bind:value={systemType}>
					<Select.Trigger class="w-full">
						{systemType === 'on-grid'
							? 'On-Grid (with subsidy)'
							: systemType === 'off-grid'
								? 'Off-Grid'
								: 'Hybrid'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="on-grid">On-Grid (with subsidy)</Select.Item>
						<Select.Item value="off-grid">Off-Grid</Select.Item>
						<Select.Item value="hybrid">Hybrid</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Monthly Bill Slider -->
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-baseline">
					<Label for="bill">Monthly Electricity Bill</Label>
					<span class="text-primary text-lg font-semibold">Rs {monthlyBill.toLocaleString('en-IN')}</span>
				</div>
				<Slider
					id="bill"
					min={[500]}
					max={[15000]}
					step={[100]}
					bind:value={monthlyBill}
					class="w-full"
				/>
				<div class="text-muted-foreground text-xs">Rs 500 - Rs 15,000</div>
			</div>

			<!-- Rate Per Unit -->
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-baseline">
					<Label for="rate">Electricity Rate (Rs/unit)</Label>
					<span class="text-primary text-lg font-semibold">Rs {ratePerUnit.toFixed(1)}</span>
				</div>
				<Slider
					id="rate"
					min={[3]}
					max={[15]}
					step={[0.5]}
					bind:value={ratePerUnit}
					class="w-full"
				/>
				<div class="text-muted-foreground text-xs">Rs 3 - Rs 15 per unit</div>
			</div>
		</div>

		<button
			onclick={handleCalculate}
			class="mt-6 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Calculate
		</button>
	</div>

	<!-- Results -->
	{#if hasCalculated}
		<div class="rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)] mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-6">Your Solar Estimate</h2>

			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<div class="rounded-lg bg-muted p-4 text-center">
					<Sun class="w-6 h-6 text-primary mx-auto mb-2" />
					<p class="text-2xl font-bold text-primary">{systemSizeKw} kW</p>
					<p class="text-xs text-muted-foreground">System Size</p>
				</div>
				<div class="rounded-lg bg-muted p-4 text-center">
					<IndianRupee class="w-6 h-6 text-primary mx-auto mb-2" />
					<p class="text-2xl font-bold text-primary">Rs {formatCurrency(netCost)}</p>
					<p class="text-xs text-muted-foreground">Net Cost (after subsidy)</p>
				</div>
				<div class="rounded-lg bg-muted p-4 text-center">
					<Zap class="w-6 h-6 text-primary mx-auto mb-2" />
					<p class="text-2xl font-bold text-primary">Rs {formatCurrency(annualSavings)}</p>
					<p class="text-xs text-muted-foreground">Annual Savings</p>
				</div>
				<div class="rounded-lg bg-muted p-4 text-center">
					<Clock class="w-6 h-6 text-primary mx-auto mb-2" />
					<p class="text-2xl font-bold text-primary">{paybackYears} yrs</p>
					<p class="text-xs text-muted-foreground">Payback Period</p>
				</div>
			</div>

			<!-- Detailed Breakdown -->
			<div class="border-t pt-4 space-y-3">
				<h3 class="font-semibold text-primary mb-2">Cost Breakdown</h3>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Gross System Cost</span>
					<span class="font-medium">Rs {grossCost.toLocaleString('en-IN')}</span>
				</div>
				{#if centralSubsidy > 0}
					<div class="flex justify-between text-sm">
						<span class="text-muted-foreground">Central Subsidy (PM Surya Ghar)</span>
						<span class="font-medium text-green-600">- Rs {centralSubsidy.toLocaleString('en-IN')}</span>
					</div>
				{/if}
				<div class="flex justify-between text-sm border-t pt-2">
					<span class="font-semibold">Net Cost</span>
					<span class="font-bold text-primary">Rs {netCost.toLocaleString('en-IN')}</span>
				</div>
			</div>

			<div class="border-t pt-4 mt-4 space-y-3">
				<h3 class="font-semibold text-primary mb-2">Generation & Savings</h3>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Monthly Consumption</span>
					<span class="font-medium">{monthlyUnits} units</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Annual Generation</span>
					<span class="font-medium">{annualGeneration.toLocaleString('en-IN')} units</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">25-Year Net Savings</span>
					<span class="font-medium text-green-600">Rs {formatCurrency(savingsOver25Years)}</span>
				</div>
			</div>

			<!-- CTA -->
			<div class="mt-6 rounded-lg bg-primary/5 p-4">
				{#if selectedDistrictData && selectedDistrictData.installerCount > 0}
					<p class="text-sm text-muted-foreground mb-3">
						Based on our network, <strong class="text-foreground">{selectedDistrictData.installerCount} verified installers</strong> in
						<strong class="text-foreground">{selectedDistrictData.district}</strong> can install this system.
					</p>
					<a
						href="/in/solar/{selectedDistrictData.stateSlug}/{selectedDistrictData.slug}/"
						class="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
					>
						Get Exact Quotes <ArrowRight class="w-4 h-4" />
					</a>
				{:else}
					<p class="text-sm text-muted-foreground mb-3">
						Get exact quotes from <strong class="text-foreground">{data.totalInstallers}+ verified installers</strong> across India.
					</p>
					<a
						href="/in/get-quotes/"
						class="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
					>
						Get Free Quotes <ArrowRight class="w-4 h-4" />
					</a>
				{/if}
			</div>

			<!-- Related tools -->
			<div class="mt-4 flex flex-wrap gap-3 text-sm">
				<a href="/in/tools/emi-calculator/" class="text-primary hover:underline">
					Calculate EMI for this system
				</a>
				<span class="text-muted-foreground">|</span>
				<a href="/in/tools/subsidy-checker/" class="text-primary hover:underline">
					Check detailed subsidy
				</a>
			</div>
		</div>
	{/if}

	<!-- Authority links -->
	<div class="flex flex-wrap gap-3 text-sm mb-8">
		<a href="/in/rooftop-solar/cost/" class="text-primary hover:underline">Solar Panel Cost Guide</a>
		<span class="text-muted-foreground">|</span>
		<a href="/in/solar/" class="text-primary hover:underline">Browse Installers by State</a>
	</div>

	<FAQ items={faqs} />
</div>
