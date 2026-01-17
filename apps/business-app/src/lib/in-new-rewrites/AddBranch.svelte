<script lang="ts">
	// @ts-nocheck - bits-ui Select component type definitions incompatible with Svelte 5
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { INDIAN_STATES } from '$lib/constants/locations';
	import { CircleAlert } from '@lucide/svelte';

	let {
		show = $bindable(false),
		businessId,
		businessSlug,
		onClose = () => {},
		onBranchAdded = () => {}
	}: {
		show: boolean;
		businessId: string;
		businessSlug: string;
		onClose: () => void;
		onBranchAdded: (branch: any) => void;
	} = $props();

	let state: string = $state('');
	let district: string = $state('');
	let city: string = $state('');
	let districts: string[] = $state([]);
	let cities: string[] = $state([]);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	// Fetch districts when state changes
	$effect(() => {
		if (state) {
			updateDistricts(state);
		}
	});

	// Fetch cities when district changes
	$effect(() => {
		if (district) {
			updateCities(district);
		}
	});

	async function updateDistricts(selectedState: string) {
		try {
			const res = await fetch('/in/api/getDistricts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ state: selectedState })
			});
			const data = await res.json();
			districts = data.districts || [];
			district = '';
			city = '';
			cities = [];
		} catch (error) {
			console.error('❌ Error fetching districts:', error);
		}
	}

	async function updateCities(selectedDistrict: string) {
		try {
			const res = await fetch('/in/api/getCities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ district: selectedDistrict })
			});
			const data = await res.json();
			cities = data.cities || [];
			city = '';
		} catch (error) {
			console.error('❌ Error fetching cities:', error);
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (!state || !district || !city) {
			errorMessage = 'Please select state, district and city';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/in/api/addBranch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ businessId, state, district, city })
			});

			const result = await response.json();

			if (result.success) {
				successMessage = 'Branch added successfully! Redirecting...';
				state = '';
				district = '';
				city = '';
				onBranchAdded(result.branch);

				setTimeout(() => {
					window.location.href = `/business/${businessSlug}/branch`;
				}, 2000);
			} else {
				errorMessage = result.error || 'Failed to add branch';
			}
		} catch (error) {
			console.error('❌ Error adding branch:', error);
			errorMessage = 'An error occurred while adding the branch';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Dialog.Root bind:open={show} onOpenChange={() => !show && onClose()}>
	<Dialog.Content class="max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Add New Branch</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-4">
			{#if errorMessage}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Description>{errorMessage}</Alert.Description>
				</Alert.Root>
			{/if}

			{#if successMessage}
				<Alert.Root>
					<Alert.Description>{successMessage}</Alert.Description>
				</Alert.Root>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-4">
				<!-- State Select -->
				<div class="space-y-2">
					<Label for="state">State</Label>
					<Select.Root type="single" bind:value={state}>
						<Select.Trigger id="state" class="w-full">
							{state || 'Select a state'}
						</Select.Trigger>
						<Select.Content>
							{#each INDIAN_STATES as s}
								<Select.Item value={s}>{s}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- District Select -->
				<div class="space-y-2">
					<Label for="district">District</Label>
					<Select.Root type="single" bind:value={district} disabled={!state || districts.length === 0}>
						<Select.Trigger id="district" class="w-full">
							{district || 'Select a district'}
						</Select.Trigger>
						<Select.Content>
							{#each districts as d}
								<Select.Item value={d}>{d}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- City Select -->
				<div class="space-y-2">
					<Label for="city">City</Label>
					<Select.Root type="single" bind:value={city} disabled={!district || cities.length === 0}>
						<Select.Trigger id="city" class="w-full">
							{city || 'Select a city'}
						</Select.Trigger>
						<Select.Content>
							{#each cities as c}
								<Select.Item value={c}>{c}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<Dialog.Footer>
					<Button
						variant="secondary"
						type="button"
						disabled={isSubmitting}
						onclick={() => (show = false)}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Adding...' : 'Add Branch'}
					</Button>
				</Dialog.Footer>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>
