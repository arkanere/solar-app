<script lang="ts">
	import { Card } from '$lib/components/ui/card';
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

<div class="flex items-center justify-center min-h-screen p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>Solar System Calculator</Card.Title>
			<Card.Description>Calculate the size of your solar system</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-6">
			<div class="space-y-2">
				<div class="flex justify-between items-baseline">
					<Label for="bill">Monthly Electricity Bill</Label>
					<span class="text-lg font-semibold text-primary">₹{currentBill}</span>
				</div>
				<Slider
					id="bill"
					min={[500]}
					max={[5000]}
					step={[100]}
					bind:value={currentBill}
					class="w-full"
				/>
				<div class="text-xs text-muted-foreground">₹500 - ₹5000</div>
			</div>

			<div class="space-y-2">
				<div class="flex justify-between items-baseline">
					<Label for="rate">Rate per Unit</Label>
					<span class="text-lg font-semibold text-primary">₹{ratePerUnit.toFixed(1)}</span>
				</div>
				<Slider
					id="rate"
					min={[3]}
					max={[15]}
					step={[0.5]}
					bind:value={ratePerUnit}
					class="w-full"
				/>
				<div class="text-xs text-muted-foreground">₹3 - ₹15 per unit</div>
			</div>

			<div class="pt-4 border-t">
				<div class="text-center">
					<p class="text-sm text-muted-foreground mb-2">Estimated System Size</p>
					<p class="text-3xl font-bold text-primary">{solarSystemSize} <span class="text-lg">kW</span></p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
