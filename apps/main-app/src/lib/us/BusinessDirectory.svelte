<!-- BusinessDirectory.svelte -->

<script>
	import { isDarkMode } from '$lib/us/themeStore'; // Import the dark mode store
	import { goto } from '$app/navigation';
	import { toSlug } from '$lib/countries/urls';
	import { onMount } from 'svelte';

	// Reactive store for theme mode
	let darkMode = $derived($isDarkMode);

	// Define reactive variables for state and county selection
	let state = $state('');
	let county = $state('');
	let counties = $state([]);
	let isLoading = $state(false);
	let mounted = false;

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

	// Ensure component is mounted before making API calls
	onMount(() => {
		mounted = true;
	});

	// Function to handle state selection change
	function handleStateChange(event) {
		const selectedState = event.target.value;
		state = selectedState;
		county = ''; // Reset county when state changes
		counties = []; // Clear counties array

		if (selectedState && mounted) {
			updateCounties(selectedState);
		}
	}

	// Function to fetch counties for a selected state
	async function updateCounties(selectedState) {
		if (!selectedState || !mounted) return;

		isLoading = true;
		try {
			// Add timestamp to prevent caching issues
			const timestamp = Date.now();
			const res = await fetch('/us/api/getCounties', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache'
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
				counties = data.districts || [];
			}
		} catch (error) {
			console.error('Error fetching counties:', error);
			counties = [];
		} finally {
			isLoading = false;
		}
	}

	// Handle county selection and navigate to the county page to view cities
	function handleCountySelection() {
		if (state && county) {
			goto(`/us/solar/${toSlug(state)}/${toSlug(county)}`, {
				force: true
			});
		}
	}
</script>

<!-- Main component structure -->
<main class={darkMode ? 'dark' : 'light'}>
	<p>Select state and county to view the solar panel installer listings:</p>

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

		<!-- County Dropdown -->
		<div>
			<label for="county">County:</label>
			<select
				id="county"
				bind:value={county}
				disabled={!state || isLoading}
				onchange={handleCountySelection}
			>
				<option value="">
					{#if isLoading}
						Loading counties...
					{:else if !state}
						Select a state first
					{:else if counties.length === 0}
						No counties found
					{:else}
						Select a county
					{/if}
				</option>
				{#each counties as c}
					<option value={c}>{c}</option>
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
