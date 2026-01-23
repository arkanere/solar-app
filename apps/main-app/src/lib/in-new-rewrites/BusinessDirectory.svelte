<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import * as Label from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { INDIA_STATES } from '$lib/constants/solarSystems';

	let selectedState = $state('');
	let selectedDistrict = $state('');
	let districts = $state<string[]>([]);
	let isLoading = $state(false);
	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});

	async function updateDistricts(state: string) {
		if (!state || !mounted) return;

		isLoading = true;
		try {
			const res = await fetch('/in/api/getDistricts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ state, timestamp: Date.now() })
			});

			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

			const data = await res.json();
			if (selectedState === state) {
				districts = data.districts || [];
			}
		} catch (error) {
			console.error('Error fetching districts:', error);
			districts = [];
		} finally {
			isLoading = false;
		}
	}

	function handleStateChange() {
		selectedDistrict = '';
		districts = [];
		if (selectedState && mounted) {
			updateDistricts(selectedState);
		}
	}

	function handleDistrictSelection() {
		if (selectedState && selectedDistrict) {
			goto(`/in/solar-panel-installer-directory/${selectedDistrict.toLowerCase()}`);
		}
	}
</script>

<div class="w-full max-w-[theme(--max-width-sm)] mx-auto">
	<Card.Root class="border border-[theme(--color-border)] shadow-[theme(--shadow-sm)]">
		<Card.Header>
			<Card.Title class="text-[theme(--font-size-2xl)] leading-[theme(--font-size-2xl--line-height)]">Solar Installer Directory</Card.Title>
			<Card.Description>
				Select state and district to view installer listings
			</Card.Description>
		</Card.Header>

		<Card.Content class="flex flex-col gap-[theme(--card-gap)]">
			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label.Root for="state">State</Label.Root>
				<Select.Root type="single" bind:value={selectedState} onValueChange={handleStateChange}>
					<Select.Trigger id="state" class="w-full">
						{selectedState || 'Select a state'}
					</Select.Trigger>
					<Select.Content>
						{#each INDIA_STATES as state}
							<Select.Item value={state}>{state}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex flex-col gap-[theme(--form-element-field-gap)]">
				<Label.Root for="district">District</Label.Root>
				<Select.Root type="single" bind:value={selectedDistrict} disabled={!selectedState || isLoading}>
					<Select.Trigger id="district" class="w-full">
						{#if isLoading}
							Loading districts...
						{:else if !selectedState}
							Select a state first
						{:else if districts.length === 0}
							No districts found
						{:else}
							{selectedDistrict || 'Select a district'}
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#each districts as district}
							<Select.Item value={district}>{district}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<Button
				onclick={handleDistrictSelection}
				disabled={!selectedState || !selectedDistrict}
				class="w-full mt-[theme(--card-gap)]"
			>
				View Installers
			</Button>
		</Card.Content>
	</Card.Root>
</div>
