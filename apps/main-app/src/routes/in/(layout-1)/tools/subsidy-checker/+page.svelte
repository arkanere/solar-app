<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import * as Select from '$lib/components/ui/select';
	import { breadcrumbLD, webAppLD } from '$lib/seo';
	import Breadcrumb from '$lib/in/components/seo/Breadcrumb.svelte';
	import FAQ from '$lib/in/components/seo/FAQ.svelte';
	import { CheckCircle, XCircle, ArrowRight, Info } from '@lucide/svelte';

	let { data } = $props();

	const BASE_URL = 'https://solarvipani.com';

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: `${BASE_URL}/in/` },
		{ name: 'Tools', url: `${BASE_URL}/in/tools/` },
		{ name: 'Subsidy Checker', url: `${BASE_URL}/in/tools/subsidy-checker/` }
	]);

	const webApp = webAppLD({
		name: 'Solar Subsidy Checker',
		description:
			'Check PM Surya Ghar Yojana central solar subsidy for your system size. See subsidy amounts, eligibility, and savings.',
		url: `${BASE_URL}/in/tools/subsidy-checker/`
	});

	const faqs = [
		{
			question: 'Who is eligible for the PM Surya Ghar solar subsidy?',
			answer:
				'Residential consumers with a valid grid connection are eligible for the PM Surya Ghar subsidy. The system must be on-grid (grid-connected) and installed by a registered vendor. Commercial and industrial connections are not eligible for central subsidies.'
		},
		{
			question: 'What are the PM Surya Ghar subsidy rates?',
			answer:
				'The central subsidy is Rs 30,000 per kW for the first 2 kW and Rs 18,000 per kW for capacity between 2-3 kW. Maximum central subsidy is Rs 78,000 for 3 kW and above systems.'
		},
		{
			question: 'Can I get both central and state subsidies?',
			answer:
				'Yes, in many states you can avail both central subsidy (PM Surya Ghar) and state-specific top-up subsidies. The state subsidy amount varies by state and may have additional eligibility conditions.'
		},
		{
			question: 'Are off-grid systems eligible for subsidies?',
			answer:
				'Off-grid and hybrid systems are generally not eligible for the PM Surya Ghar central subsidy. Some states may offer separate subsidies for off-grid systems, but these are less common.'
		}
	];

	const faqLdJson = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.question,
			acceptedAnswer: { '@type': 'Answer', text: f.answer }
		}))
	};

	// Form state
	let selectedState = $state('');
	let selectedDistrict = $state('');
	let systemSizeKw = $state(3);
	let connectionType = $state('residential');
	let gridConnection = $state('yes');
	let hasChecked = $state(false);

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

	// Central subsidy calculation (PM Surya Ghar slabs)
	const centralSubsidy = $derived.by(() => {
		if (connectionType !== 'residential' || gridConnection !== 'yes') return 0;
		const kw = systemSizeKw;
		if (kw <= 2) return Math.round(kw * 30000);
		if (kw <= 3) return 60000 + Math.round((kw - 2) * 18000);
		return 78000; // max for 3+ kW
	});

	const isEligibleCentral = $derived(
		connectionType === 'residential' && gridConnection === 'yes'
	);

	const eligibilityReasons = $derived.by(() => {
		const reasons: string[] = [];
		if (connectionType !== 'residential')
			reasons.push('Central subsidy is only for residential connections.');
		if (gridConnection !== 'yes')
			reasons.push('Central subsidy requires a grid-connected (on-grid) system.');
		return reasons;
	});

	const estimatedCost = $derived(
		Math.round(systemSizeKw * (systemSizeKw <= 3 ? 55000 : systemSizeKw <= 5 ? 50000 : 45000))
	);
	const netCost = $derived(estimatedCost - centralSubsidy);

	function handleCheck() {
		hasChecked = true;
	}

	function formatCurrency(n: number): string {
		if (n >= 100000) return `Rs ${(n / 100000).toFixed(1)} Lakh`;
		return `Rs ${n.toLocaleString('en-IN')}`;
	}
</script>

<svelte:head>
	<title>Solar Subsidy Checker — PM Surya Ghar Yojana Subsidy Calculator | Solar Vipani</title>
	<meta
		name="description"
		content="Check PM Surya Ghar Yojana central solar subsidy for your system size. See subsidy amounts, eligibility, and net cost after subsidy. Free subsidy calculator."
	/>
	<link rel="canonical" href="{BASE_URL}/in/tools/subsidy-checker/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(webApp)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqLdJson)}</script>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<Breadcrumb
		items={[
			{ name: 'Home', href: '/in/' },
			{ name: 'Tools', href: '/in/tools/' },
			{ name: 'Subsidy Checker', href: '/in/tools/subsidy-checker/' }
		]}
	/>

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">Solar Subsidy Checker</h1>
	<p class="text-muted-foreground mb-8 max-w-2xl">
		Check your eligibility and subsidy amount under the PM Surya Ghar Yojana — the Government of
		India's national rooftop solar subsidy scheme.
	</p>

	<!-- Calculator Form -->
	<div class="rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)] mb-8">
		<h2 class="text-lg font-semibold text-primary mb-4">Check Your Subsidy Eligibility</h2>
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

			<!-- Connection Type -->
			<div class="flex flex-col gap-2">
				<Label for="connection">Connection Type</Label>
				<Select.Root type="single" bind:value={connectionType}>
					<Select.Trigger class="w-full">
						{connectionType === 'residential'
							? 'Residential'
							: connectionType === 'commercial'
								? 'Commercial'
								: 'Institutional'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="residential">Residential</Select.Item>
						<Select.Item value="commercial">Commercial</Select.Item>
						<Select.Item value="institutional">Institutional</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Grid Connection -->
			<div class="flex flex-col gap-2">
				<Label for="grid">Grid Connection</Label>
				<Select.Root type="single" bind:value={gridConnection}>
					<Select.Trigger class="w-full">
						{gridConnection === 'yes' ? 'Yes (On-Grid)' : 'No (Off-Grid)'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="yes">Yes (On-Grid)</Select.Item>
						<Select.Item value="no">No (Off-Grid)</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- System Size -->
			<div class="flex flex-col gap-2 md:col-span-2">
				<div class="flex justify-between items-baseline">
					<Label for="size">System Size</Label>
					<span class="text-primary text-lg font-semibold">{systemSizeKw} kW</span>
				</div>
				<Slider
					id="size"
					min={[1]}
					max={[10]}
					step={[0.5]}
					bind:value={systemSizeKw}
					class="w-full"
				/>
				<div class="text-muted-foreground text-xs">1 kW – 10 kW</div>
			</div>
		</div>

		<button
			onclick={handleCheck}
			class="mt-6 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Check Subsidy
		</button>
	</div>

	<!-- Results -->
	{#if hasChecked}
		<div class="rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)] mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-6">Subsidy Details</h2>

			<!-- Eligibility Status -->
			<div
				class="flex items-start gap-3 rounded-lg border p-4 mb-6 {isEligibleCentral
					? 'border-green-600/30 bg-green-600/10'
					: 'border-red-600/30 bg-red-600/10'}"
			>
				{#if isEligibleCentral}
					<CheckCircle class="w-5 h-5 text-primary shrink-0 mt-0.5" />
					<div>
						<p class="font-semibold text-foreground">
							Eligible for PM Surya Ghar Subsidy
						</p>
						<p class="text-sm text-muted-foreground">
							Your system qualifies for the central government subsidy.
						</p>
					</div>
				{:else}
					<XCircle class="w-5 h-5 text-destructive shrink-0 mt-0.5" />
					<div>
						<p class="font-semibold text-foreground">
							Not Eligible for Central Subsidy
						</p>
						{#each eligibilityReasons as reason}
							<p class="text-sm text-muted-foreground">{reason}</p>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Subsidy Breakdown -->
			<div class="space-y-3">
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">System Size</span>
					<span class="font-medium">{systemSizeKw} kW</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Estimated System Cost</span>
					<span class="font-medium">{formatCurrency(estimatedCost)}</span>
				</div>
				<div class="flex justify-between text-sm border-t pt-2">
					<span class="text-muted-foreground">Central Subsidy (PM Surya Ghar)</span>
					<span class="font-medium {centralSubsidy > 0 ? 'text-green-600' : ''}">
						{centralSubsidy > 0
							? `- ${formatCurrency(centralSubsidy)}`
							: 'Not applicable'}
					</span>
				</div>
				<div class="flex justify-between text-sm border-t pt-2">
					<span class="font-semibold">Net Cost (after subsidy)</span>
					<span class="font-bold text-primary">{formatCurrency(netCost)}</span>
				</div>
			</div>

			<!-- PM Surya Ghar Yojana Info -->
			<div class="mt-6 rounded-lg border p-4">
				<h3 class="font-semibold text-primary mb-2">PM Surya Ghar Yojana — Subsidy Slabs</h3>
				<p class="text-sm text-muted-foreground mb-3">
					Central government scheme providing direct subsidy for residential rooftop solar. Applicable to on-grid systems installed by registered vendors.
				</p>
				<div class="space-y-1 text-sm text-muted-foreground">
					<div class="flex justify-between">
						<span>Up to 2 kW</span>
						<span class="font-medium text-foreground">Rs 30,000 / kW</span>
					</div>
					<div class="flex justify-between">
						<span>2 – 3 kW</span>
						<span class="font-medium text-foreground">Rs 18,000 / kW</span>
					</div>
					<div class="flex justify-between">
						<span>Above 3 kW</span>
						<span class="font-medium text-foreground">Max Rs 78,000</span>
					</div>
				</div>
			</div>

			<!-- State Subsidies — Coming Soon -->
			<div class="mt-6 flex items-start gap-3 rounded-lg bg-muted p-4">
				<Info class="w-5 h-5 text-primary shrink-0 mt-0.5" />
				<div>
					<p class="font-semibold text-sm">{selectedState} State Subsidy</p>
					<p class="text-sm text-muted-foreground">
						Top-up subsidy data for {selectedState} is coming soon. Some states offer additional subsidies on top of the central PM Surya Ghar scheme.
					</p>
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
						Get Quotes with Subsidy Applied <ArrowRight class="w-4 h-4" />
					</a>
				{:else}
					<p class="text-sm text-muted-foreground mb-3">
						Get exact quotes with subsidy applied from
						<strong class="text-foreground">{data.totalInstallers}+ verified installers</strong>.
					</p>
					<a
						href="/in/get-quotes/"
						class="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
					>
						Get Quotes with Subsidy Applied <ArrowRight class="w-4 h-4" />
					</a>
				{/if}
			</div>

			<!-- Related tools -->
			<div class="mt-4 flex flex-wrap gap-3 text-sm">
				<a href="/in/tools/solar-calculator/" class="text-primary hover:underline">
					Calculate system size & cost
				</a>
				<span class="text-muted-foreground">|</span>
				<a href="/in/tools/emi-calculator/" class="text-primary hover:underline">
					Calculate EMI
				</a>
			</div>
		</div>
	{/if}

	<!-- Authority links -->
	<div class="flex flex-wrap gap-3 text-sm mb-8">
		<a href="/in/solar-subsidy/how-to-apply/" class="text-primary hover:underline">
			How to Apply for Solar Subsidy
		</a>
		<span class="text-muted-foreground">|</span>
		<a href="/in/solar/" class="text-primary hover:underline">Browse Installers</a>
	</div>

	<FAQ items={faqs} />
</div>
