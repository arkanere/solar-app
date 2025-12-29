<!-- AddBranch.svelte -->
<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Select } from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';

	let {
		show = $bindable(false),
		businessId,
		businessSlug, // Added business slug for redirection
		onClose = () => {},
		onBranchAdded = () => {}
	} = $props();

	// Define reactive variables for state, district, and city selection
	let state = $state('');
	let district = $state('');
	let city = $state('');
	let districts = $state([]);
	let cities = $state([]);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	// List of states
	const states = [
		'Andaman and Nicobar Islands',
		'Andhra Pradesh',
		'Arunachal Pradesh',
		'Assam',
		'Bihar',
		'Chandigarh',
		'Chhattisgarh',
		'Dadra and Nagar Haveli and Daman and Diu',
		'Delhi',
		'Goa',
		'Gujarat',
		'Haryana',
		'Himachal Pradesh',
		'Jammu and Kashmir',
		'Jharkhand',
		'Karnataka',
		'Kerala',
		'Ladakh',
		'Lakshadweep',
		'Madhya Pradesh',
		'Maharashtra',
		'Manipur',
		'Meghalaya',
		'Mizoram',
		'Nagaland',
		'Odisha',
		'Puducherry',
		'Punjab',
		'Rajasthan',
		'Sikkim',
		'Tamil Nadu',
		'Telangana',
		'Tripura',
		'Uttar Pradesh',
		'Uttarakhand',
		'West Bengal'
	];

	// Fetch districts dynamically when the state changes
	$effect(() => {
		if (state) {
			updateDistricts(state);
		}
	});

	// Fetch cities dynamically when the district changes
	$effect(() => {
		if (district) {
			updateCities(district);
		}
	});

	// Function to fetch districts for a selected state
	async function updateDistricts(selectedState) {
		try {
			const res = await fetch('/in/api/getDistricts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ state: selectedState })
			});
			const data = await res.json();
			districts = data.districts || [];
			district = ''; // Reset district when state changes
			city = ''; // Reset city when state changes
			cities = []; // Clear cities list
		} catch (error) {
			console.error('Error fetching districts:', error);
		}
	}

	// Function to fetch cities for a selected district
	async function updateCities(selectedDistrict) {
		try {
			const res = await fetch('/in/api/getCities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ district: selectedDistrict })
			});
			const data = await res.json();
			cities = data.cities || [];
			city = ''; // Reset city when district changes
		} catch (error) {
			console.error('Error fetching cities:', error);
		}
	}

	function handleOpenChange(open) {
		if (!open) {
			show = false;
			onClose();
		}
	}

	function close() {
		if (isSubmitting) return; // Prevent closing during submission
		show = false;
		onClose();
	}

	// Handle form submission
	async function handleSubmit(event) {
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
				body: JSON.stringify({
					businessId,
					state,
					district,
					city
				})
			});

			const result = await response.json();

			if (result.success) {
				successMessage = 'Branch added successfully! Redirecting...';
				// Reset form
				state = '';
				district = '';
				city = '';

				// Notify parent component
				onBranchAdded(result.branch);

				// Redirect to the branch page after a short delay
				setTimeout(() => {
					window.location.href = `/business/${businessSlug}/branch`;
				}, 2000);
			} else {
				errorMessage = result.error || 'Failed to add branch';
			}
		} catch (error) {
			console.error('Error adding branch:', error);
			errorMessage = 'An error occurred while adding the branch';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Add New Branch</Dialog.Title>
		</Dialog.Header>

		{#if errorMessage}
			<div class="text-destructive mb-4 p-2 bg-destructive-muted rounded">{errorMessage}</div>
		{/if}

		{#if successMessage}
			<div class="text-success mb-4 p-2 bg-success-muted rounded">{successMessage}</div>
		{/if}

		<form onsubmit={handleSubmit}>
			<!-- State Dropdown -->
			<div class="mb-4">
				<Label for="state" class="block mb-2 font-bold">State:</Label>
				<Select id="state" bind:value={state} required class="w-full">
					<option value="">Select a state</option>
					{#each states as s}
						<option value={s}>{s}</option>
					{/each}
				</Select>
			</div>

			<!-- District Dropdown -->
			<div class="mb-4">
				<Label for="district" class="block mb-2 font-bold">District:</Label>
				<Select
					id="district"
					bind:value={district}
					required
					disabled={!state || districts.length === 0}
					class="w-full"
				>
					<option value="">Select a district</option>
					{#each districts as d}
						<option value={d}>{d}</option>
					{/each}
				</Select>
			</div>

			<!-- City Dropdown -->
			<div class="mb-4">
				<Label for="city" class="block mb-2 font-bold">City:</Label>
				<Select
					id="city"
					bind:value={city}
					required
					disabled={!district || cities.length === 0}
					class="w-full"
				>
					<option value="">Select a city</option>
					{#each cities as c}
						<option value={c}>{c}</option>
					{/each}
				</Select>
			</div>

			<Dialog.Footer>
				<Button variant="secondary" disabled={isSubmitting} onclick={close}>
					Cancel
				</Button>
				<Button
					type="submit"
					class="bg-success text-success-foreground hover:bg-success/90"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Adding...' : 'Add Branch'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
