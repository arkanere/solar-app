<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	let queries = $page.data.queries || [];
	let errorMessage = $page.data.errorMessage;

	$: darkMode = $isDarkMode;

	// State for the modal form
	let isEditing = false;
	let selectedQuery = null;

	// Function to open the edit form with the selected query's data
	function editClaim(claimId) {
		selectedQuery = queries.find((query) => query.id === claimId);
		console.log(claimId);
		isEditing = true;
	}

	async function saveChanges() {
		// Destructure the updated fields from selectedQuery
		const { id, name, phone, pincode, message, notes } = selectedQuery;

		try {
			// Send the updated query data to the server
			const response = await fetch('/api/updateQuery', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id, name, phone, pincode, message, notes })
			});

			if (!response.ok) {
				throw new Error('Failed to save changes');
			}

			// reflect the saved changes.
			const updatedQuery = await response.json();
			queries = queries.map((query) => (query.id === updatedQuery.id ? updatedQuery : query));

			// Show success alert
			alert('Changes saved successfully!');

			// Close the modal after saving
			isEditing = false;
			selectedQuery = null;
		} catch (error) {
			console.error(error);
			alert('An error occurred while saving changes.');
		}
	}

	// Function to close the modal form without saving
	function cancelEdit() {
		isEditing = false;
		selectedQuery = null;
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Queries</h1>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if queries.length > 0}
		<ul>
			{#each queries as query}
				<li>
					<h2>{query.name}</h2>
					<p>Phone: {query.phone}</p>
					<p>Pin code: {query.pincode}</p>
					<p>Message: {query.message}</p>
					<p>Created At: {new Date(query.created_at).toLocaleString()}</p>
					<p>Notes: {query.notes}</p>
					<p>Urlpath: {query.urlparam}</p>
					<button class="edit-button" on:click={() => editClaim(query.id)}> Edit </button>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No queries found.</p>
	{/if}

	<!-- Edit Form Modal -->
	{#if isEditing && selectedQuery}
		<div class="modal-overlay" on:click={cancelEdit}>
			<div class="modal-content" on:click|stopPropagation>
				<h2>Edit Query</h2>
				<form on:submit|preventDefault={saveChanges}>
					<label>
						Name:
						<input type="text" bind:value={selectedQuery.name} />
					</label>
					<label>
						Phone:
						<input type="text" bind:value={selectedQuery.phone} />
					</label>
					<label>
						Pin code:
						<input type="text" bind:value={selectedQuery.pincode} />
					</label>
					<label>
						Message:
						<textarea bind:value={selectedQuery.message}></textarea>
					</label>
					<label>
						Notes:
						<textarea bind:value={selectedQuery.notes}></textarea>
					</label>
					<div class="modal-buttons">
						<button type="button" on:click={cancelEdit}>Cancel</button>
						<button type="submit">Save</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa; /* Light background color */
		--dark-bg-color: #1a1a1a; /* Dark background color */
		--light-primary-text-color: #333; /* Dark text for light mode */
		--dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
		--light-secondary-text-color: #666; /* Lighter gray for secondary text in light mode */
		--dark-secondary-text-color: #ccc; /* Lighter gray for secondary text in dark mode */
		--accent-color: #0056b3; /* Blue accent for headings */
		--light-border-color: #ddd; /* Light border color for light mode */
		--dark-border-color: #444; /* Dark border color for dark mode */
		--font-family: 'Helvetica Neue', Arial, sans-serif; /* Clean font family */
	}

	/* Main layout */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	/* Light mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Page title styling */
	h1 {
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
	}

	.light h1 {
		color: var(--light-primary-text-color);
	}

	.dark h1 {
		color: var(--dark-primary-text-color);
	}

	/* Error message styling */
	.error-message {
		color: red;
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
	}

	/* List styling */
	ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
		max-width: 600px;
	}

	/* List item styling */
	li {
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	/* Light mode list item */
	.light li {
		background-color: #fff;
		border: 1px solid var(--light-border-color);
	}

	/* Dark mode list item */
	.dark li {
		background-color: #333;
		border: 1px solid var(--dark-border-color);
	}

	/* Lead name styling */
	h2 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.light h2 {
		color: var(--accent-color);
	}

	.dark h2 {
		color: var(--accent-color);
	}

	/* Paragraph styling */
	p {
		font-size: 1rem;
		margin-bottom: 0.75rem;
	}

	.light p {
		color: var(--light-secondary-text-color);
	}

	.dark p {
		color: var(--dark-secondary-text-color);
	}

	/* Created at date special styling */
	li p:last-child {
		font-size: 0.9rem;
		margin-top: 1rem;
	}

	.light li p:last-child {
		color: var(--light-primary-text-color);
	}

	.dark li p:last-child {
		color: var(--dark-primary-text-color);
	}

	/* Button styling */
	button {
		padding: 10px 15px;
		font-size: 1rem;
		font-weight: bold;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		margin-right: 10px; /* Space between buttons */
	}

	.edit-button {
		background-color: #4caf50; /* Green */
		color: white;
	}

	.edit-button:hover {
		background-color: #45a049; /* Darker green on hover */
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		background: white;
		padding: 20px;
		border-radius: 8px;
		width: 400px;
	}

	.modal-content h2 {
		margin-top: 0;
	}

	.modal-buttons {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}
</style>
