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
	<div class="text-center mb-8">
		<h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">Solar System Calculator</h2>
		<div class="flex justify-center items-center my-4">
			<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
		</div>
	</div>
	<div class="flex items-center justify-center">
		<CardRoot class="w-full max-w-sm border-0 shadow-none bg-transparent">
			<CardContent class="gap-6 flex flex-col">
			<div class="gap-2 flex flex-col">
				<div class="flex justify-between items-baseline">
					<Label for="bill">Monthly Electricity Bill</Label>
					<span class="text-primary text-lg font-semibold">₹{currentBill}</span>
				</div>
				<Slider
					id="bill"
					min={[500]}
					max={[5000]}
					step={[100]}
					bind:value={currentBill}
					class="w-full"
				/>
				<div class="text-muted-foreground text-xs">₹500 - ₹5000</div>
			</div>

			<div class="gap-2 flex flex-col">
				<div class="flex justify-between items-baseline">
					<Label for="rate">Rate per Unit</Label>
					<span class="text-primary text-lg font-semibold">₹{ratePerUnit.toFixed(1)}</span>
				</div>
				<Slider
					id="rate"
					min={[3]}
					max={[15]}
					step={[0.5]}
					bind:value={ratePerUnit}
					class="w-full"
				/>
				<div class="text-muted-foreground text-xs">₹3 - ₹15 per unit</div>
			</div>

			<div class="border-t pt-4">
				<div class="text-center">
					<p class="text-muted-foreground text-sm mb-2">Estimated System Size</p>
					<p class="text-primary text-3xl font-bold">{solarSystemSize} <span class="text-lg">kW</span></p>
				</div>
			</div>
		</CardContent>
		</CardRoot>
	</div>
</section>
