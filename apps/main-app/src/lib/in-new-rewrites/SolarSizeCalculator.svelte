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

<div class="flex items-center justify-center min-h-screen p-[theme(--spacing-lg)]">
	<CardRoot class="w-full max-w-[theme(--max-width-sm)]">
		<CardHeader>
			<CardTitle>Solar System Calculator</CardTitle>
			<CardDescription>Calculate the size of your solar system</CardDescription>
		</CardHeader>
		<CardContent class="gap-[theme(--spacing-xl)] flex flex-col">
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
					<p class="text-primary text-[theme(--font-size-3xl)] font-bold">{solarSystemSize} <span class="text-[theme(--font-size-lg)]">kW</span></p>
				</div>
			</div>
		</CardContent>
	</CardRoot>
</div>
