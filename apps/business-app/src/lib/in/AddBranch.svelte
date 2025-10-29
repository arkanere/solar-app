<!-- AddBranch.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';

	export let show = false;
	export let businessId;
	export let businessSlug; // Added business slug for redirection

	const dispatch = createEventDispatcher();

	// Define reactive variables for state, district, and city selection
	let state = '';
	let district = '';
	let city = '';
	let districts = [];
	let cities = [];
	let isSubmitting = false;
	let errorMessage = '';
	let successMessage = '';

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
	$: if (state) {
		updateDistricts(state);
	}

	// Fetch cities dynamically when the district changes
	$: if (district) {
		updateCities(district);
	}

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

	// Handle form submission
	async function handleSubmit() {
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
				dispatch('branchAdded', result.branch);

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

	function closeModal() {
		dispatch('close');
	}
</script>

{#if show}
	<div class="modal-backdrop">
		<div class="modal">
			<div class="modal-header">
				<h2>Add New Branch</h2>
				<button class="close-btn" on:click={closeModal}>×</button>
			</div>

			<div class="modal-body">
				{#if errorMessage}
					<div class="error-message">{errorMessage}</div>
				{/if}

				{#if successMessage}
					<div class="success-message">{successMessage}</div>
				{/if}

				<form on:submit|preventDefault={handleSubmit}>
					<!-- State Dropdown -->
					<div class="form-group">
						<label for="state">State:</label>
						<select id="state" bind:value={state} required>
							<option value="">Select a state</option>
							{#each states as s}
								<option value={s}>{s}</option>
							{/each}
						</select>
					</div>

					<!-- District Dropdown -->
					<div class="form-group">
						<label for="district">District:</label>
						<select
							id="district"
							bind:value={district}
							required
							disabled={!state || districts.length === 0}
						>
							<option value="">Select a district</option>
							{#each districts as d}
								<option value={d}>{d}</option>
							{/each}
						</select>
					</div>

					<!-- City Dropdown -->
					<div class="form-group">
						<label for="city">City:</label>
						<select
							id="city"
							bind:value={city}
							required
							disabled={!district || cities.length === 0}
						>
							<option value="">Select a city</option>
							{#each cities as c}
								<option value={c}>{c}</option>
							{/each}
						</select>
					</div>

					<div class="form-actions">
						<button type="button" on:click={closeModal} disabled={isSubmitting}>Cancel</button>
						<button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Adding...' : 'Add Branch'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background-color: white;
		border-radius: 4px;
		width: 90%;
		max-width: 500px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #eee;
	}

	.modal-header h2 {
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.modal-body {
		padding: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	.form-group select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button[type='button'] {
		background-color: #f3f3f3;
	}

	button[type='submit'] {
		background-color: #4caf50;
		color: white;
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.error-message {
		color: #d32f2f;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background-color: #ffebee;
		border-radius: 4px;
	}

	.success-message {
		color: #2e7d32;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background-color: #e8f5e9;
		border-radius: 4px;
	}
</style>
