<!-- AddBranch.svelte -->
<script lang="ts">
	export type AddBranchProps = {
		show?: boolean;
		businessId: number;
		businessSlug?: string;
		onClose?: () => void;
		onBranchAdded?: () => void;
	};

	let { show = false, businessId, businessSlug, onClose, onBranchAdded }: AddBranchProps = $props();

	// Define reactive variables for state, county, and city selection
	let state = $state('');
	let county = $state('');
	let city = $state('');
	let counties = $state([]);
	let cities = $state([]);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	// List of US states
	const states = [
		'Alabama',
		'Alaska',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'District of Columbia',
		'Florida',
		'Georgia',
		'Hawaii',
		'Idaho',
		'Illinois',
		'Indiana',
		'Iowa',
		'Kansas',
		'Kentucky',
		'Louisiana',
		'Maine',
		'Maryland',
		'Massachusetts',
		'Michigan',
		'Minnesota',
		'Mississippi',
		'Missouri',
		'Montana',
		'Nebraska',
		'Nevada',
		'New Hampshire',
		'New Jersey',
		'New Mexico',
		'New York',
		'North Carolina',
		'North Dakota',
		'Ohio',
		'Oklahoma',
		'Oregon',
		'Pennsylvania',
		'Rhode Island',
		'South Carolina',
		'South Dakota',
		'Tennessee',
		'Texas',
		'Utah',
		'Vermont',
		'Virginia',
		'Washington',
		'West Virginia',
		'Wisconsin',
		'Wyoming',
		'Puerto Rico'
	];

	// Fetch counties dynamically when the state changes
	$effect(() => {
		if (state) {
			updateCounties(state);
		}
	});

	// Fetch cities dynamically when the county changes
	$effect(() => {
		if (county) {
			updateCities(county);
		}
	});

	// Function to fetch counties for a selected state
	async function updateCounties(selectedState) {
		try {
			const res = await fetch('/us/api/getCounties', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ state: selectedState })
			});
			const data = await res.json();
			counties = data.counties || [];
			county = ''; // Reset county when state changes
			city = ''; // Reset city when state changes
			cities = []; // Clear cities list
		} catch (error) {
			console.error('Error fetching counties:', error);
		}
	}

	// Function to fetch cities for a selected county
	async function updateCities(selectedCounty) {
		try {
			const res = await fetch('/us/api/getCities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ county: selectedCounty })
			});
			const data = await res.json();
			cities = data.cities || [];
			city = ''; // Reset city when county changes
		} catch (error) {
			console.error('Error fetching cities:', error);
		}
	}

	// Handle form submission
	async function handleSubmit() {
		errorMessage = '';
		successMessage = '';

		if (!state || !county || !city) {
			errorMessage = 'Please select state, county and city';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/us/api/addBranch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					businessId,
					state,
					county: county,
					city
				})
			});

			const result = await response.json();

			if (result.success) {
				successMessage = 'Branch added successfully! Redirecting...';
				// Reset form
				state = '';
				county = '';
				city = '';

				// Notify parent component
				if (onBranchAdded) {
					onBranchAdded(result.branch);
				}

				// Redirect to the branch page after a short delay
				setTimeout(() => {
					window.location.href = `/us/${businessSlug}/branch`;
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
		if (onClose) {
			onClose();
		}
	}
</script>

{#if show}
	<div class="modal-backdrop">
		<div class="modal">
			<div class="modal-header">
				<h2>Add New Branch</h2>
				<button class="close-btn" onclick={closeModal}>×</button>
			</div>

			<div class="modal-body">
				{#if errorMessage}
					<div class="error-message">{errorMessage}</div>
				{/if}

				{#if successMessage}
					<div class="success-message">{successMessage}</div>
				{/if}

				<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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

					<!-- County Dropdown -->
					<div class="form-group">
						<label for="county">County:</label>
						<select
							id="county"
							bind:value={county}
							required
							disabled={!state || counties.length === 0}
						>
							<option value="">Select a county</option>
							{#each counties as c}
								<option value={c}>{c}</option>
							{/each}
						</select>
					</div>

					<!-- City Dropdown -->
					<div class="form-group">
						<label for="city">City:</label>
						<select id="city" bind:value={city} required disabled={!county || cities.length === 0}>
							<option value="">Select a city</option>
							{#each cities as c}
								<option value={c}>{c}</option>
							{/each}
						</select>
					</div>

					<div class="form-actions">
						<button type="button" onclick={closeModal} disabled={isSubmitting}>Cancel</button>
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
