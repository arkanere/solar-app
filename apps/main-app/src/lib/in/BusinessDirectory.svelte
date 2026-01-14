<!-- BusinessDirectory.svelte -->

<script>
	import { isDarkMode } from '$lib/themeStore'; // Import the dark mode store
	import { goto } from '$app/navigation';

	// Reactive store for theme mode
	let darkMode = $derived($isDarkMode);

	// Define reactive variables for state and district selection
	let state = $state('');
	let district = $state('');
	let districts = $state([]);
	let isLoading = $state(false);
	let mounted = $state(false);
	let initializationDone = $state(false);

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

	// Ensure component is mounted before making API calls
	$effect(() => {
		if (!initializationDone) {
			mounted = true;
			initializationDone = true;
		}
	});

	// Function to handle state selection change
	function handleStateChange(event) {
		const selectedState = event.target.value;
		state = selectedState;
		district = ''; // Reset district when state changes
		districts = []; // Clear districts array
		
		if (selectedState && mounted) {
			updateDistricts(selectedState);
		}
	}

	// Function to fetch districts for a selected state
	async function updateDistricts(selectedState) {
		if (!selectedState || !mounted) return;
		
		isLoading = true;
		try {
			// Add timestamp to prevent caching issues
			const timestamp = Date.now();
			const res = await fetch('/in/api/getDistricts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
					'Pragma': 'no-cache'
				},
				body: JSON.stringify({
					state: selectedState,
					timestamp: timestamp
				})
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const data = await res.json();

			// Only update if this is still the current state
			if (state === selectedState) {
				districts = data.districts || [];
			}
		} catch (error) {
			console.error('Error fetching districts:', error);
			districts = [];
		} finally {
			isLoading = false;
		}
	}

	// Handle district selection and navigate to the desired URL
	function handleDistrictSelection() {
		if (state && district) {
			goto(`/in/solar-panel-installer-directory/${district.toLowerCase()}`, { force: true });
		}
	}
</script>

<!-- Main component structure -->
<main class={darkMode ? 'dark' : 'light'}>
	<p>Select state and district to view the solar panel installer listings:</p>

	<form>
		<!-- State Dropdown -->
		<div>
			<label for="state">State:</label>
			<select id="state" value={state} onchange={handleStateChange} required>
				<option value="">Select a state</option>
				{#each states as s}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</div>

		<!-- District Dropdown -->
		<div>
			<label for="district">District:</label>
			<select
				id="district"
				bind:value={district}
				disabled={!state || isLoading}
				onchange={handleDistrictSelection}
			>
				<option value="">
					{#if isLoading}
						Loading districts...
					{:else if !state}
						Select a state first
					{:else if districts.length === 0}
						No districts found
					{:else}
						Select a district
					{/if}
				</option>
				{#each districts as d}
					<option value={d}>{d}</option>
				{/each}
			</select>
		</div>
	</form>
</main>

<style>
	/* Styles similar to what you provided earlier, tailored to the component */
	:root {
		--light-bg-color: #f8f9fa;
		--light-text-color: #333;
		--dark-bg-color: #1a1a1a;
		--dark-text-color: #f0f0f0;
		--accent-color: #ffc107: --hover-color: #003366;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* padding: 3rem 1rem; */
		font-family: var(--font-family);
		box-sizing: border-box;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--light-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-text-color);
	}

	p {
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
		text-align: center;
		line-height: 1.5;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 400px;
		width: 100%;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		background-color: #fff;
		transition: background-color 0.3s ease;
	}

	.dark form {
		background-color: #2e2e2e;
	}

	div {
		margin-bottom: 1.2rem;
		width: 100%;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-size: 1rem;
	}

	select {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background-color: #f8f9fa;
		font-family: var(--font-family);
		transition: border 0.3s;
	}

	select:focus {
		border: 1px solid var(--accent-color);
		outline: none;
	}

	.dark select {
		background-color: #333;
		color: var(--dark-text-color);
	}
</style>
