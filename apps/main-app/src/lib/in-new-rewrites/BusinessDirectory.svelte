<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import * as Label from '$lib/components/ui/label';
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
			goto(`/in/solar-panel-installer-directory/${selectedDistrict.toLowerCase()}`, { force: true });
		}
	}
</script>

<main style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: var(--button-height-lg); padding-bottom: var(--button-height-lg); padding-left: 1rem; padding-right: 1rem;">
	<div style="width: 100%; max-width: var(--max-width-sm);">
		<Card.Root style="border: 1px solid hsl(var(--border)); box-shadow: var(--shadow-lg);">
			<Card.Header>
				<Card.Title style="font-size: var(--font-size-2xl); line-height: var(--font-size-2xl--line-height);">Solar Installer Directory</Card.Title>
				<Card.Description>
					Select state and district to view installer listings
				</Card.Description>
			</Card.Header>

			<Card.Content style="display: flex; flex-direction: column; gap: var(--card-gap);">
				<div style="display: flex; flex-direction: column; gap: var(--form-element-field-gap);">
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

				<div style="display: flex; flex-direction: column; gap: var(--form-element-field-gap);">
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

				<button
					onclick={handleDistrictSelection}
					disabled={!selectedState || !selectedDistrict}
					style="width: 100%; margin-top: var(--card-gap); padding-left: var(--button-padding-x-default); padding-right: var(--button-padding-x-default); padding-top: var(--button-padding-y-default); padding-bottom: var(--button-padding-y-default); background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: var(--radius-md); font-weight: 500; transition: all var(--transition-default);"
					onmouseenter={(e) => !e.currentTarget.disabled && e.currentTarget.style.setProperty('background-color', 'hsl(var(--primary) / 0.9)')}
					onmouseleave={(e) => e.currentTarget.style.setProperty('background-color', 'hsl(var(--primary))')}
				>
					View Installers
				</button>
			</Card.Content>
		</Card.Root>
	</div>
</main>
