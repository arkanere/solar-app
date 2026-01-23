<script lang="ts">
	import { Root as CardRoot, Header as CardHeader, Title as CardTitle, Description as CardDescription, Content as CardContent } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';

	let currentBill = $state(1500);
	let ratePerUnit = $state(9);
	let solarSystemSize = $derived.by(() => {
		const monthlyConsumption = currentBill / ratePerUnit;
		const kW = monthlyConsumption / 100;
		return parseFloat(kW.toFixed(2));
	});
</script>

<section class="mb-8 rounded-[theme(--radius-lg)] bg-card p-[theme(--card-padding-y)] shadow-[theme(--shadow-md)] transition-all w-full">
	<div class="text-center mb-[theme(--spacing-2xl)]">
		<h2 class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-lg)] text-primary">Solar System Calculator</h2>
		<div class="flex justify-center items-center my-[theme(--spacing-lg)]">
			<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
		</div>
	</div>
	<div class="flex items-center justify-center">
		<CardRoot class="w-full max-w-[theme(--max-width-sm)] border-0 shadow-none bg-transparent">
			<CardContent class="gap-[theme(--spacing-2xl)] flex flex-col">
			<div class="gap-[theme(--spacing-sm)] flex flex-col">
				<div class="flex justify-between items-baseline">
					<Label for="bill">Monthly Electricity Bill</Label>
					<span class="text-primary text-[theme(--font-size-lg)] font-semibold">₹{currentBill}</span>
				</div>
				<Slider
					id="bill"
					min={[500]}
					max={[5000]}
					step={[100]}
					bind:value={currentBill}
					class="w-full"
				/>
				<div class="text-muted-foreground text-[theme(--font-size-xs)]">₹500 - ₹5000</div>
			</div>

			<div class="gap-[theme(--spacing-sm)] flex flex-col">
				<div class="flex justify-between items-baseline">
					<Label for="rate">Rate per Unit</Label>
					<span class="text-primary text-[theme(--font-size-lg)] font-semibold">₹{ratePerUnit.toFixed(1)}</span>
				</div>
				<Slider
					id="rate"
					min={[3]}
					max={[15]}
					step={[0.5]}
					bind:value={ratePerUnit}
					class="w-full"
				/>
				<div class="text-muted-foreground text-[theme(--font-size-xs)]">₹3 - ₹15 per unit</div>
			</div>

			<div class="border-t pt-[theme(--spacing-lg)]">
				<div class="text-center">
					<p class="text-muted-foreground text-[theme(--font-size-sm)] mb-[theme(--spacing-sm)]">Estimated System Size</p>
					<p class="text-primary text-[theme(--font-size-4xl)] font-bold">{solarSystemSize} <span class="text-[theme(--font-size-lg)]">kW</span></p>
				</div>
			</div>
		</CardContent>
		</CardRoot>
	</div>
</section>
