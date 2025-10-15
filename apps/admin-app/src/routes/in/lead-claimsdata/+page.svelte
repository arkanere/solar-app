<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore'; // Import dark mode state

	let leadClaims = $page.data.leadClaims || [];
	let errorMessage = $page.data.errorMessage;

	$: darkMode = $isDarkMode; // Watch for changes in dark mode state

	let isProcessing = false;
	let selectedClaim = null;
	let updatedIsAllotted = false;

	// Function to open the process modal
	function openProcessModal(claim) {
		selectedClaim = { ...claim };
		updatedIsAllotted = claim.isallotted;
		isProcessing = true;
	}

	// Function to close the modal
	function closeProcessModal() {
		isProcessing = false;
		selectedClaim = null;
	}

	function closeModal() {
		isProcessing = false;
		selectedClaim = null;
	}

	// Function to handle "Resolve" button click
	async function resolveClaim() {
		if (!selectedClaim) return;

		selectedClaim.isresolved = true; // Set isResolved to true

		try {
			const response = await fetch('/api/updateLeadClaim', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: selectedClaim.id,
					lead_id: selectedClaim.lead_id, // ✅ Send lead_id
					business_id: selectedClaim.business_id, // ✅ Send business_id
					isallotted: selectedClaim.isallotted,
					isresolved: selectedClaim.isresolved
				})
			});

			const result = await response.json();

			if (result.success) {
				// Update UI with new values
				leadClaims = leadClaims.map((claim) =>
					claim.id === selectedClaim.id ? selectedClaim : claim
				);

				alert('Claim resolved successfully!');
				closeModal();
			} else {
				alert(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Error updating claim:', error);
			alert('Failed to update claim.');
		}
	}

	function convertToIST(utcDateString) {
		const utcDate = new Date(utcDateString);
		const istOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds (5 hours 30 minutes)
		const istDate = new Date(utcDate.getTime() + istOffset);

		return istDate.toLocaleString('en-IN', {
			timeZone: 'Asia/Kolkata',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Lead Claims Data</h1>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if leadClaims.length > 0}
		<ul>
			{#each leadClaims as claim}
				<li>
					<h2>Lead_Claim ID: {claim.id}</h2>
					<p><strong>Lead ID:</strong> {claim.lead_id}</p>
					<p><strong>Claim ID:</strong> {claim.claim_id}</p>
					<p><strong>Business ID:</strong> {claim.business_id}</p>
					<p><strong>Created at: </strong>{convertToIST(claim.created_at)}</p>
					<p><strong>isAllotted:</strong> {claim.isallotted ? 'Yes' : 'No'}</p>
					<p><strong>isResolved:</strong> {claim.isresolved ? 'Yes' : 'No'}</p>

					<!-- Flex container for button alignment -->
					<div class="button-container">
						<button class="process-button" on:click={() => openProcessModal(claim)}>Process</button>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No lead claims found.</p>
	{/if}

	<!-- Modal Form -->
	{#if isProcessing && selectedClaim}
		<div class="modal-overlay" on:click={closeProcessModal}>
			<div class="modal-content" on:click|stopPropagation>
				<h2>Process Lead Claim</h2>
				<p><strong>Lead Claim ID:</strong> {selectedClaim.id}</p>
				<p><strong>Lead ID:</strong> {selectedClaim.lead_id}</p>
				<p><strong>Claim ID:</strong> {selectedClaim.claim_id}</p>
				<p><strong>Business ID:</strong> {selectedClaim.business_id}</p>

				<label>
					<span>Allotted:</span>
					<select bind:value={selectedClaim.isallotted}>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</label>

				<div class="modal-buttons">
					<button class="cancel-button" on:click={closeProcessModal}>Cancel</button>
					<button class="resolve-button" on:click={resolveClaim}>Resolve</button>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		font-family: 'Helvetica Neue', Arial, sans-serif;
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.light {
		background-color: #f8f9fa;
		color: #333;
	}

	.dark {
		background-color: #1a1a1a;
		color: #f0f0f0;
	}

	h1 {
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
	}

	.error-message {
		color: red;
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
	}

	ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
		max-width: 600px;
	}

	/* Ensure the list item is displayed correctly */
	li {
		position: relative;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
		display: flex;
		flex-direction: column;
		margin-bottom: 1.5rem;
	}

	/* Container to align button to the right */
	.button-container {
		display: flex;
		justify-content: flex-end; /* Aligns the button to the right */
		margin-top: 10px;
	}

	/* Process button styling */
	.process-button {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 5px;
		cursor: pointer;
	}

	.process-button:hover {
		background-color: #0056b3;
	}

	.light li {
		background-color: #fff;
		border: 1px solid #ddd;
	}

	.dark li {
		background-color: #333;
		border: 1px solid #444;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	p {
		font-size: 1rem;
		margin-bottom: 0.75rem;
	}

	.process-button {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 5px;
		cursor: pointer;
	}

	.process-button:hover {
		background-color: #0056b3;
	}

	/* Modal Styling */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		width: 90%;
		max-width: 400px;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.modal-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}

	.cancel-button {
		background-color: #dc3545;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.cancel-button:hover {
		background-color: #c82333;
	}

	.resolve-button {
		background-color: #28a745;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.resolve-button:hover {
		background-color: #218838;
	}

	/* Dropdown Styling */
	select {
		width: 100%;
		padding: 10px;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: white;
		cursor: pointer;
	}

	select:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
	}
</style>
