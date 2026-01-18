<script lang="ts">
	import { isDarkMode } from '$lib/themeStore.svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import * as Label from '$lib/components/ui/label';
	import { INDIA_STATES } from '$lib/constants/solarSystems';

	let darkMode = $derived($isDarkMode);

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

<main class="min-h-screen flex flex-col items-center justify-center py-12 px-4">
	<div class="w-full max-w-md">
		<Card.Root class="border shadow-lg">
			<Card.Header>
				<Card.Title class="text-2xl">Solar Installer Directory</Card.Title>
				<Card.Description>
					Select state and district to view installer listings
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-6">
				<div class="space-y-3">
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

				<div class="space-y-3">
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
					class="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					View Installers
				</button>
			</Card.Content>
		</Card.Root>
	</div>
</main>
