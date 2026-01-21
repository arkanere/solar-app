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

<div class="flex items-center justify-center min-h-screen" style="padding: var(--space-y-4);">
	<Card.Root class="w-full" style="max-width: var(--max-width-sm);">
		<Card.Header>
			<Card.Title>Solar System Calculator</Card.Title>
			<Card.Description>Calculate the size of your solar system</Card.Description>
		</Card.Header>
		<Card.Content style="gap: var(--space-y-6); display: flex; flex-direction: column;">
			<div style="gap: var(--space-y-2); display: flex; flex-direction: column;">
				<div class="flex justify-between items-baseline">
					<Label for="bill">Monthly Electricity Bill</Label>
					<span class="text-primary" style="font-size: var(--font-size-lg); line-height: var(--font-size-lg--line-height); font-weight: 600;">₹{currentBill}</span>
				</div>
				<Slider
					id="bill"
					min={[500]}
					max={[5000]}
					step={[100]}
					bind:value={currentBill}
					class="w-full"
				/>
				<div class="text-muted-foreground" style="font-size: var(--font-size-xs); line-height: var(--font-size-xs--line-height);">₹500 - ₹5000</div>
			</div>

			<div style="gap: var(--space-y-2); display: flex; flex-direction: column;">
				<div class="flex justify-between items-baseline">
					<Label for="rate">Rate per Unit</Label>
					<span class="text-primary" style="font-size: var(--font-size-lg); line-height: var(--font-size-lg--line-height); font-weight: 600;">₹{ratePerUnit.toFixed(1)}</span>
				</div>
				<Slider
					id="rate"
					min={[3]}
					max={[15]}
					step={[0.5]}
					bind:value={ratePerUnit}
					class="w-full"
				/>
				<div class="text-muted-foreground" style="font-size: var(--font-size-xs); line-height: var(--font-size-xs--line-height);">₹3 - ₹15 per unit</div>
			</div>

			<div class="border-t" style="padding-top: var(--space-y-4);">
				<div class="text-center">
					<p class="text-muted-foreground" style="font-size: var(--font-size-sm); line-height: var(--font-size-sm--line-height); margin-bottom: var(--space-y-2);">Estimated System Size</p>
					<p class="text-primary" style="font-size: var(--font-size-3xl); line-height: var(--font-size-3xl--line-height); font-weight: 700;">{solarSystemSize} <span style="font-size: var(--font-size-lg); line-height: var(--font-size-lg--line-height);">kW</span></p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
