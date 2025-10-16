<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore'; // Import dark mode state

	let leads = $page.data.leads || [];
	let errorMessage = $page.data.errorMessage;

	// State for the modal form
	let isEditing = false;
	let selectedLead = null;

	$: darkMode = $isDarkMode; // Watch for changes in dark mode state

	// Function for editing a lead - now uses a modal instead of navigation
	function editLead(leadId) {
		selectedLead = leads.find((lead) => lead.id === leadId);
		isEditing = true;
	}

	// Function to save changes to a lead
	async function saveChanges() {
		// Destructure the updated fields from selectedLead
		const {
			id,
			name,
			phone,
			email,
			pin_code,
			type,
			comment,
			svnotes,
			sv_comment_for_businesses,
			district,
			category,
			stage,
			status
		} = selectedLead;

		try {
			// Send the updated lead data to the server
			const response = await fetch('/in/api/updateLead', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id,
					name,
					phone,
					email,
					pin_code,
					type,
					comment,
					svnotes,
					sv_comment_for_businesses,
					district,
					category,
					stage,
					status
				})
			});

			if (!response.ok) {
				throw new Error('Failed to save changes');
			}

			// Reflect the saved changes.
			const updatedLead = await response.json();
			leads = leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead));

			// Show success alert
			alert('Changes saved successfully!');

			// Close the modal after saving
			isEditing = false;
			selectedLead = null;
		} catch (error) {
			console.error(error);
			alert('An error occurred while saving changes.');
		}
	}

	// Function to close the modal form without saving
	function cancelEdit() {
		isEditing = false;
		selectedLead = null;
	}

	// Function to send lead details via email
	async function shareLeadOnMail(lead, businessSlug) {
		try {
			const response = await fetch('/in/api/sendLeadDetails', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ lead, business_slug: businessSlug })
			});

			const result = await response.json();

			if (result.success) {
				alert('Lead details sent successfully!');
			} else {
				alert(`Failed to send lead details: ${result.error}`);
			}
		} catch (error) {
			console.error('Error sending lead details:', error);
			alert('Error sending lead details.');
		}
	}

	function getStageLabel(stage) {
		const stages = {
			0: 'New Inquiry',
			1: 'Qualified',
			2: 'Proposal Sent',
			3: 'Won'
		};
		return stages[stage] || 'Unknown'; // Fallback for unexpected values
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Lead Data</h1>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if leads.length > 0}
		<ul>
			{#each leads as lead}
				<li>
					<h2>{lead.name}</h2>
					<p>Phone: {lead.phone}</p>
					<p>Pin Code: {lead.pin_code}</p>
					<p>Email: {lead.email}</p>
					<p>Type: {lead.type}</p>
					<p>Comment: {lead.comment}</p>
					<p>Created At: {new Date(lead.created_at).toLocaleString()}</p>
					<p>Lead ID: {lead.id}</p>
					<p>Source page: {lead.urlparams}</p>
					<p>SV Note: {lead.svnotes}</p>
					<p>SV Comment for Businesses: {lead.sv_comment_for_businesses || 'null'}</p>
					<p>District: {lead.district}</p>
					<p>Category: {lead.category}</p>
					<p>Claimed count: {lead.claim_count}</p>
					<p>Business ID: {lead.business_id}</p>
					<p>Stage: {getStageLabel(lead.stage)}</p>
					<p>Status: {lead.status ? 'Active' : 'Inactive'}</p>
					<p>Email Invites Sent: {lead.email_invite_count || 0}</p>
					<button class="edit-button" on:click={() => editLead(lead.id)}> Edit </button>
					<button
						class="share-button"
						on:click={() => shareLeadOnMail(lead, lead.urlparams.split('/').pop())}
					>
						Share on Mail
					</button>
					<!-- Share on Mail Button -->
				</li>
			{/each}
		</ul>
	{:else}
		<p>No leads found.</p>
	{/if}

	<!-- Edit Form Modal -->
	{#if isEditing && selectedLead}
		<div class="modal-overlay" on:click={cancelEdit}>
			<div class="modal-content" on:click|stopPropagation>
				<h2>Edit Lead</h2>
				<form on:submit|preventDefault={saveChanges}>
					<label>
						Name:
						<input type="text" bind:value={selectedLead.name} />
					</label>
					<label>
						Phone:
						<input type="text" bind:value={selectedLead.phone} />
					</label>
					<label>
						Pin code:
						<input type="text" bind:value={selectedLead.pin_code} />
					</label>
					<label>
						Email:
						<input type="text" bind:value={selectedLead.email} />
					</label>
					<label>
						Type:
						<input type="text" bind:value={selectedLead.type} />
					</label>
					<label>
						Comment:
						<textarea bind:value={selectedLead.comment}></textarea>
					</label>
					<label>
						SV Note:
						<textarea bind:value={selectedLead.svnotes}></textarea>
					</label>
					<label>
						SV Comment for Businesses:
						<textarea bind:value={selectedLead.sv_comment_for_businesses}></textarea>
					</label>
					<label>
						District:
						<input type="text" bind:value={selectedLead.district} />
					</label>
					<label>
						Category:
						<input type="number" bind:value={selectedLead.category} min="0" max="9" />
					</label>
					<label>
						Stage:
						<input type="number" bind:value={selectedLead.stage} min="0" max="4" />
					</label>
					<label>
						Status:
						<select bind:value={selectedLead.status}>
							<option value={true}>Active</option>
							<option value={false}>Inactive</option>
						</select>
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

	.share-button {
		background-color: #0056b3; /* Accent color */
		color: white;
	}

	.share-button:hover {
		background-color: #004494; /* Darker blue on hover */
	}

	.light .share-button {
		background-color: #0056b3;
	}

	.dark .share-button {
		background-color: #339af0; /* Light blue for dark mode */
	}

	/* Modal Styling */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		overflow: hidden; /* Prevents background scrolling */
	}

	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		position: relative;
		max-width: 500px;
		width: 100%;
		max-height: 80vh; /* Limits height to 80% of viewport */
		overflow-y: auto; /* Enables vertical scrolling */
	}
	/* Ensure inputs and textarea do not overflow */
	.modal-content input,
	.modal-content textarea {
		width: 100%;
		box-sizing: border-box;
	}
	/* Style for the status dropdown */
	.modal-content select {
		width: 100%;
		padding: 10px;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: white;
		appearance: none; /* Removes default browser styling */
		cursor: pointer;
	}

	/* Optional: Improve dropdown focus styling */
	.modal-content select:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
	}

	.modal-content.dark {
		background: #444;
		color: #f0f0f0;
	}

	.modal-buttons {
		margin-top: 1.5rem;
		display: flex;
		justify-content: space-between;
	}

	.modal-content button {
		padding: 10px 15px;
		font-size: 1rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	/* Make the form a flex column or grid for clarity */
	.modal-content form {
		display: flex;
		flex-direction: column; /* stack each label vertically */
		gap: 1rem; /* spacing between form fields */
	}

	/* Label styling */
	.modal-content form label {
		display: flex;
		flex-direction: column; /* put <span> and <input> / <textarea> in one column */
		font-weight: bold;
		margin-bottom: 0.25rem;
	}
	.modal-content form label span {
		margin-bottom: 0.25rem; /* small gap between label text and input */
	}

	/* Input/textarea styling */
	.modal-content form input,
	.modal-content form textarea {
		font-weight: normal;
		font-size: 1rem;
		padding: 0.5rem;
		border: 1px solid #ccc; /* or var(--light-border-color) in light mode */
		border-radius: 4px;
		resize: vertical; /* allow vertical resizing of textarea */
	}

	/* Modal buttons grouped at the bottom */
	.modal-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
	}
</style>
