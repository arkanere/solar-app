<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { US_STATES } from '$lib/constants/locations';
	import { CircleAlert } from '@lucide/svelte';

	let {
		show = $bindable(false),
		businessId,
		businessSlug,
		onClose = () => {},
		onBranchAdded = (_branch: any) => {}
	}: {
		show: boolean;
		businessId: string;
		businessSlug: string;
		onClose: () => void;
		onBranchAdded: (branch: any) => void;
	} = $props();

	// Named selectedState (not `state`) so svelte2tsx doesn't mistake $state for a store subscription
	let selectedState: string = $state('');
	let county: string = $state('');
	let city: string = $state('');
	let counties: string[] = $state([]);
	let cities: string[] = $state([]);
	let isSubmitting: boolean = $state(false);
	let errorMessage: string = $state('');
	let successMessage: string = $state('');

	// Fetch counties when state changes
	$effect(() => {
		if (selectedState) {
			updateCounties(selectedState);
		}
	});

	// Fetch cities when county changes
	$effect(() => {
		if (county) {
			updateCities(county);
		}
	});

	async function updateCounties(stateName: string) {
		try {
			const res = await fetch('/us/api/getCounties', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ state: stateName })
			});
			const data = await res.json();
			counties = data.counties || [];
			county = '';
			city = '';
			cities = [];
		} catch (error) {
			console.error('❌ Error fetching counties:', error);
		}
	}

	async function updateCities(selectedCounty: string) {
		try {
			const res = await fetch('/us/api/getCities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ county: selectedCounty })
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

		if (!selectedState || !county || !city) {
			errorMessage = 'Please select state, county and city';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/us/api/addBranch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ businessId, state: selectedState, county, city })
			});

			const result = await response.json();

			if (result.success) {
				successMessage = 'Branch added successfully! Redirecting...';
				selectedState = '';
				county = '';
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

<Dialog.Root bind:open={show} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
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
					<!-- @ts-expect-error bits-ui children prop -->
					<Select.Root type="single" bind:value={selectedState}>
						<!-- @ts-ignore -->
						<Select.Trigger id="state" class="w-full">
							{selectedState || 'Select a state'}
						</Select.Trigger>
						<!-- @ts-ignore -->
						<Select.Content>
							{#each US_STATES as s}
								<!-- @ts-expect-error bits-ui children prop -->
								<Select.Item value={s}>{s}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- County Select -->
				<div class="space-y-2">
					<Label for="county">County</Label>
					<!-- @ts-expect-error bits-ui children prop -->
					<Select.Root
						type="single"
						bind:value={county}
						disabled={!selectedState || counties.length === 0}
					>
						<!-- @ts-expect-error bits-ui children prop -->
						<Select.Trigger id="county" class="w-full">
							{county || 'Select a county'}
						</Select.Trigger>
						<!-- @ts-expect-error bits-ui children prop -->
						<Select.Content>
							{#each counties as c}
								<!-- @ts-expect-error bits-ui children prop -->
								<Select.Item value={c}>{c}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- City Select -->
				<div class="space-y-2">
					<Label for="city">City</Label>
					<!-- @ts-expect-error bits-ui children prop -->
					<Select.Root type="single" bind:value={city} disabled={!county || cities.length === 0}>
						<!-- @ts-expect-error bits-ui children prop -->
						<Select.Trigger id="city" class="w-full">
							{city || 'Select a city'}
						</Select.Trigger>
						<!-- @ts-expect-error bits-ui children prop -->
						<Select.Content>
							{#each cities as c}
								<!-- @ts-expect-error bits-ui children prop -->
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
