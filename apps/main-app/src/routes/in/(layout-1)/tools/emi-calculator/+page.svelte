<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import * as Select from '$lib/components/ui/select';
	import { breadcrumbLD, webAppLD } from '$lib/seo';
	import Breadcrumb from '$lib/in/components/seo/Breadcrumb.svelte';
	import { IndianRupee, Percent, Calendar, ArrowRight } from '@lucide/svelte';

	let { data } = $props();

	const BASE_URL = 'https://solarvipani.com';

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: `${BASE_URL}/in/` },
		{ name: 'Tools', url: `${BASE_URL}/in/tools/` },
		{ name: 'EMI Calculator', url: `${BASE_URL}/in/tools/emi-calculator/` }
	]);

	const webApp = webAppLD({
		name: 'Solar EMI Calculator',
		description:
			'Calculate monthly EMI for solar panel loans. Compare rates across banks and find the best financing for your solar installation in India.',
		url: `${BASE_URL}/in/tools/emi-calculator/`
	});

	// Form state
	let loanAmount = $state(300000);
	let tenureMonths = $state('60');
	let interestRate = $state(9);
	let hasCalculated = $state(false);

	// EMI formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
	function calculateEmi(principal: number, annualRate: number, months: number) {
		if (annualRate === 0) return principal / months;
		const r = annualRate / 12 / 100;
		const n = months;
		return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
	}

	const tenure = $derived(parseInt(tenureMonths));
	const emi = $derived(Math.round(calculateEmi(loanAmount, interestRate, tenure)));
	const totalPayment = $derived(emi * tenure);
	const totalInterest = $derived(totalPayment - loanAmount);

	// Bank comparison
	const bankComparisons = $derived(
		data.banks.map(
			(bank: { slug: string; name: string; interestRate: string; maxAmount: string; tenure: string }) => {
				const rate = parseFloat(bank.interestRate) || interestRate;
				const bankEmi = Math.round(calculateEmi(loanAmount, rate, tenure));
				const bankTotal = bankEmi * tenure;
				return {
					...bank,
					rate,
					emi: bankEmi,
					totalPayment: bankTotal,
					totalInterest: bankTotal - loanAmount
				};
			}
		)
	);

	function handleCalculate() {
		hasCalculated = true;
	}
</script>

<svelte:head>
	<title>Solar EMI Calculator — Monthly Loan Payment Estimator | Solar Vipani</title>
	<meta
		name="description"
		content="Calculate monthly EMI for solar panel loans. Compare interest rates across SBI, HDFC, and other banks. Free solar loan calculator for India."
	/>
	<link rel="canonical" href="{BASE_URL}/in/tools/emi-calculator/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(webApp)}</script>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<Breadcrumb
		items={[
			{ name: 'Home', href: '/in/' },
			{ name: 'Tools', href: '/in/tools/' },
			{ name: 'EMI Calculator', href: '/in/tools/emi-calculator/' }
		]}
	/>

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">Solar EMI Calculator</h1>
	<p class="text-muted-foreground mb-8 max-w-2xl">
		Calculate monthly EMI for your solar panel loan. Adjust loan amount, tenure, and interest rate
		to find the best financing option.
	</p>

	<!-- Calculator Form -->
	<div class="rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)] mb-8">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Loan Amount -->
			<div class="flex flex-col gap-2 md:col-span-2">
				<div class="flex justify-between items-baseline">
					<Label for="loan">Loan Amount</Label>
					<span class="text-primary text-lg font-semibold">
						Rs {loanAmount.toLocaleString('en-IN')}
					</span>
				</div>
				<Slider
					id="loan"
					min={[50000]}
					max={[2000000]}
					step={[10000]}
					bind:value={loanAmount}
					class="w-full"
				/>
				<div class="text-muted-foreground text-xs">Rs 50,000 - Rs 20,00,000</div>
			</div>

			<!-- Interest Rate -->
			<div class="flex flex-col gap-2">
				<div class="flex justify-between items-baseline">
					<Label for="interest">Interest Rate (% p.a.)</Label>
					<span class="text-primary text-lg font-semibold">{interestRate.toFixed(1)}%</span>
				</div>
				<Slider
					id="interest"
					min={[5]}
					max={[18]}
					step={[0.25]}
					bind:value={interestRate}
					class="w-full"
				/>
				<div class="text-muted-foreground text-xs">5% - 18%</div>
			</div>

			<!-- Tenure -->
			<div class="flex flex-col gap-2">
				<Label for="tenure">Loan Tenure</Label>
				<Select.Root type="single" bind:value={tenureMonths}>
					<Select.Trigger class="w-full">
						{tenure} months ({Math.round(tenure / 12)} {tenure === 12 ? 'year' : 'years'})
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="12">12 months (1 year)</Select.Item>
						<Select.Item value="24">24 months (2 years)</Select.Item>
						<Select.Item value="36">36 months (3 years)</Select.Item>
						<Select.Item value="48">48 months (4 years)</Select.Item>
						<Select.Item value="60">60 months (5 years)</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<button
			onclick={handleCalculate}
			class="mt-6 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Calculate EMI
		</button>
	</div>

	<!-- Results -->
	{#if hasCalculated}
		<div class="rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)] mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-6">EMI Breakdown</h2>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div class="rounded-lg bg-muted p-4 text-center">
					<IndianRupee class="w-6 h-6 text-primary mx-auto mb-2" />
					<p class="text-2xl font-bold text-primary">Rs {emi.toLocaleString('en-IN')}</p>
					<p class="text-xs text-muted-foreground">Monthly EMI</p>
				</div>
				<div class="rounded-lg bg-muted p-4 text-center">
					<Percent class="w-6 h-6 text-primary mx-auto mb-2" />
					<p class="text-2xl font-bold text-primary">Rs {totalInterest.toLocaleString('en-IN')}</p>
					<p class="text-xs text-muted-foreground">Total Interest</p>
				</div>
				<div class="rounded-lg bg-muted p-4 text-center">
					<Calendar class="w-6 h-6 text-primary mx-auto mb-2" />
					<p class="text-2xl font-bold text-primary">Rs {totalPayment.toLocaleString('en-IN')}</p>
					<p class="text-xs text-muted-foreground">Total Payment</p>
				</div>
			</div>

			<!-- Payment Breakdown -->
			<div class="border-t pt-4 space-y-3">
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Loan Amount</span>
					<span class="font-medium">Rs {loanAmount.toLocaleString('en-IN')}</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Interest Rate</span>
					<span class="font-medium">{interestRate.toFixed(2)}% p.a.</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Tenure</span>
					<span class="font-medium">{tenure} months</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Principal Component</span>
					<span class="font-medium">
						{Math.round((loanAmount / totalPayment) * 100)}% of total
					</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Interest Component</span>
					<span class="font-medium">
						{Math.round((totalInterest / totalPayment) * 100)}% of total
					</span>
				</div>
			</div>
		</div>

		<!-- Bank Comparison -->
		{#if bankComparisons.length > 0}
			<div class="rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)] mb-8">
				<h2 class="text-2xl font-semibold text-primary mb-4">Compare Bank Schemes</h2>
				<p class="text-sm text-muted-foreground mb-4">
					EMI comparison for Rs {loanAmount.toLocaleString('en-IN')} over {tenure} months.
				</p>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b">
								<th class="text-left py-2 pr-4 font-medium text-muted-foreground">Bank</th>
								<th class="text-right py-2 px-4 font-medium text-muted-foreground">Rate</th>
								<th class="text-right py-2 px-4 font-medium text-muted-foreground">Monthly EMI</th>
								<th class="text-right py-2 pl-4 font-medium text-muted-foreground">Total Interest</th>
							</tr>
						</thead>
						<tbody>
							{#each bankComparisons as bank}
								<tr class="border-b last:border-0">
									<td class="py-2.5 pr-4">
										<a
											href="/in/solar-financing/{bank.slug}/"
											class="text-primary hover:underline font-medium"
										>
											{bank.name}
										</a>
									</td>
									<td class="text-right py-2.5 px-4">{bank.rate.toFixed(2)}%</td>
									<td class="text-right py-2.5 px-4 font-medium">
										Rs {bank.emi.toLocaleString('en-IN')}
									</td>
									<td class="text-right py-2.5 pl-4">
										Rs {bank.totalInterest.toLocaleString('en-IN')}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<!-- CTA -->
		<div class="rounded-lg bg-primary/5 p-6 mb-8">
			<p class="text-sm text-muted-foreground mb-3">
				Ready to finance your solar installation? Get connected with verified installers who can
				help with financing options.
			</p>
			<a
				href="/in/get-quotes/"
				class="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
			>
				Apply for Solar Financing <ArrowRight class="w-4 h-4" />
			</a>
		</div>
	{/if}

	<!-- Authority links -->
	<div class="flex flex-wrap gap-3 text-sm mb-8">
		<a href="/in/tools/solar-calculator/" class="text-primary hover:underline">Solar Calculator</a>
		<span class="text-muted-foreground">|</span>
		<a href="/in/solar-financing/" class="text-primary hover:underline">Solar Financing Guide</a>
		<span class="text-muted-foreground">|</span>
		<a href="/in/solar/" class="text-primary hover:underline">Browse Installers</a>
	</div>
</div>
