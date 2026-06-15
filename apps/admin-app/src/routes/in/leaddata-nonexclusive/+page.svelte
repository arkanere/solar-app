<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore'; // Import dark mode state

	let leads = $page.data.leads || [];
	let errorMessage = $page.data.errorMessage;

	// State for the modal form
	let isEditing = false;
	let selectedLead = null;

	// State for confirmation modals
	let showConfirmModal = false;
	let confirmAction = null;
	let confirmLead = null;
	let confirmActionType = '';
	let isExecutingAction = false;

	// State for pincode mapping modal
	let showPincodeModal = false;
	let pincodeLead = null;
	let pincodeDistrict = '';
	let pincodeState = '';
	let isSavingPincode = false;
	let isLoadingDistricts = false;
	let availableDistricts = [];

	const INDIAN_STATES = [
		"Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
		"Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
		"Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
		"Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
		"Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
		"Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
	];

	function openPincodeModal(lead) {
		pincodeLead = lead;
		pincodeDistrict = '';
		pincodeState = '';
		availableDistricts = [];
		showPincodeModal = true;
	}

	function closePincodeModal() {
		showPincodeModal = false;
		pincodeLead = null;
		pincodeDistrict = '';
		pincodeState = '';
		availableDistricts = [];
	}

	async function onStateChange() {
		pincodeDistrict = '';
		availableDistricts = [];
		if (!pincodeState) return;

		isLoadingDistricts = true;
		try {
			const response = await fetch('/in/api/getDistrictsByState', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ state: pincodeState })
			});
			const result = await response.json();
			availableDistricts = result.districts || [];
		} catch (error) {
			console.error(error);
		} finally {
			isLoadingDistricts = false;
		}
	}

	async function savePincodeMapping() {
		if (!pincodeDistrict || !pincodeState) {
			alert('Both state and district are required.');
			return;
		}
		isSavingPincode = true;
		try {
			const response = await fetch('/in/api/addPincodeMapping', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pincode: pincodeLead.pin_code,
					district: pincodeDistrict,
					state: pincodeState,
					leadId: pincodeLead.id
				})
			});
			const result = await response.json();
			if (result.success) {
				leads = leads.map(l => l.id === pincodeLead.id ? { ...l, district: pincodeDistrict } : l);
				alert('Pincode mapping added successfully!');
				closePincodeModal();
			} else {
				alert(result.error || 'Failed to add pincode mapping.');
			}
		} catch (error) {
			console.error(error);
			alert('Error saving pincode mapping.');
		} finally {
			isSavingPincode = false;
		}
	}

	// State for WhatsApp reminder modal
	let showWhatsappModal = false;
	let whatsappBusinesses = [];
	let whatsappLead = null;
	let isLoadingBusinesses = false;

	async function openWhatsappModal(lead) {
		if (!lead.district || lead.district.trim() === '') {
			alert('District is missing for this lead.');
			return;
		}
		whatsappLead = lead;
		isLoadingBusinesses = true;
		showWhatsappModal = true;

		try {
			const response = await fetch('/in/api/getDistrictBusinessesWhatsapp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ district: lead.district, lead_id: lead.id })
			});
			const result = await response.json();
			if (result.success) {
				whatsappBusinesses = result.businesses;
			} else {
				alert(result.error || 'Failed to fetch businesses.');
				showWhatsappModal = false;
			}
		} catch (error) {
			console.error(error);
			alert('Error fetching businesses.');
			showWhatsappModal = false;
		} finally {
			isLoadingBusinesses = false;
		}
	}

	function closeWhatsappModal() {
		showWhatsappModal = false;
		whatsappBusinesses = [];
		whatsappLead = null;
	}

	function openWhatsappLink(business) {
		const url = getWhatsappLink(business);
		window.open(url, 'whatsapp-reminder');
	}

	function getWhatsappLink(business) {
		let phone = business.whatsapp.replace(/[^0-9]/g, '');
		phone = phone.replace(/^0+/, '');
		if (!phone.startsWith('91') || phone.length === 10) {
			phone = '91' + phone;
		}
		const sharedDate = new Date(whatsappLead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
		const customerComment = whatsappLead.comment ? `\n\nCustomer Comment: ${whatsappLead.comment}` : '';
		const message = `Dear ${business.businessname}, we received a solar installation inquiry and shared it with you at ${business.login_email} from admin@solarvipani.com around ${sharedDate}. Please check.${customerComment}`;
		return `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
	}

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
			status,
			qualification_score
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
					status,
					qualification_score
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

	// Function to send lead details via email to all district businesses
	async function shareMaskedLeadWithDistrictBusinesses(lead, businessSlug) {
		try {
			// Check if lead category is 1 (non-exclusive)
			if (lead.category !== 1) {
				throw new Error('This lead is not a non-exclusive lead (category must be 1). Cannot share lead.');
			}

			// Ensure the lead has a valid district
			if (!lead.district || lead.district.trim() === '') {
				throw new Error('District value is missing. Cannot share lead.');
			}

			const response = await fetch('/in/api/shareMaskedLeadWithDistrictBusinesses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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
			alert(error.message || 'Error sending lead details.');
		}
	}

	// Function to send lead details via email to all district businesses
	async function shareMaskedLeadWithUnverifedBusinesses(lead, businessSlug) {
		try {
			// Check if lead category is 1 (non-exclusive)
			if (lead.category !== 1) {
				throw new Error('This lead is not a non-exclusive lead (category must be 1). Cannot share lead.');
			}

			// Ensure the lead has a valid district
			if (!lead.district || lead.district.trim() === '') {
				throw new Error('District value is missing. Cannot share lead.');
			}

			const response = await fetch('/in/api/shareMaskedLeadWithUnverifiedBusinesses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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
			alert(error.message || 'Error sending lead details.');
		}
	}

	// Function to send lead details via email to all state businesses
	async function shareMaskedLeadWithStateBusinesses(lead, businessSlug) {
		try {
			// Check if lead category is 1 (non-exclusive)
			if (lead.category !== 1) {
				throw new Error('This lead is not a non-exclusive lead (category must be 1). Cannot share lead.');
			}

			// Ensure the lead has a valid district
			if (!lead.district || lead.district.trim() === '') {
				throw new Error('District value is missing. Cannot share lead.');
			}

			const response = await fetch('/in/api/shareMaskedLeadWithStateBusinesses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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
			alert(error.message || 'Error sending lead details.');
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

	// Confirmation modal functions
	function showConfirmation(actionType, lead, action) {
		confirmActionType = actionType;
		confirmLead = lead;
		confirmAction = action;
		showConfirmModal = true;
	}

	function cancelConfirmation() {
		if (isExecutingAction) return; // Prevent cancel during execution
		showConfirmModal = false;
		confirmAction = null;
		confirmLead = null;
		confirmActionType = '';
	}

	async function executeConfirmedAction() {
		if (!confirmAction || !confirmLead || isExecutingAction) return;
		
		isExecutingAction = true;
		
		try {
			await confirmAction(confirmLead, confirmLead.urlparams.split('/').pop());
		} catch (error) {
			console.error('Error executing action:', error);
		} finally {
			isExecutingAction = false;
			cancelConfirmation();
		}
	}

	// Helper functions to show specific confirmations
	function confirmDistrictVerified(lead) {
		showConfirmation('district-verified', lead, shareMaskedLeadWithDistrictBusinesses);
	}

	function confirmDistrictUnverified(lead) {
		showConfirmation('district-unverified', lead, shareMaskedLeadWithUnverifedBusinesses);
	}

	function confirmStateVerified(lead) {
		showConfirmation('state-verified', lead, shareMaskedLeadWithStateBusinesses);
	}

	// Get confirmation message based on action type
	function getConfirmationMessage(actionType, lead) {
		const messages = {
			'district-verified': `Share masked lead details with all verified businesses in ${lead.district} district?`,
			'district-unverified': `Share masked lead details with all unverified businesses in ${lead.district} district?`,
			'state-verified': `Share masked lead details with all verified businesses in the state?`
		};
		return messages[actionType] || 'Are you sure you want to proceed?';
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Nonexclusive Lead Data</h1>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if leads.length > 0}
		<ul>
			{#each leads as lead}
				<li class={lead.has_business_in_district ? '' : 'no-business-in-district'}>
					<h2>{lead.name}</h2>
					<p>Lead Id: {lead.id}</p>
					<p>Phone: {lead.phone}</p>
					<p>Pin Code: {lead.pin_code}</p>
					<p>Email: {lead.email}</p>
					<p>Type: {lead.type}</p>
					<p>Comment: {lead.comment}</p>
					<p>Source page: {lead.urlparams}</p>
					<p>SV Note: {lead.svnotes}</p>
					<p>SV Comment for Businesses: {lead.sv_comment_for_businesses || 'null'}</p>
					<p>Created At: {new Date(lead.created_at).toLocaleString()}</p>
					<p>District: {lead.district}</p>
					<p>Category: {lead.category}</p>
					<p>Claimed count: {lead.claim_count}</p>
					<p>Business ID: {lead.business_id}</p>
					<p>Stage: {getStageLabel(lead.stage)}</p>
					<p>Status: {lead.status ? 'Active' : 'Inactive'}</p>
					<p>Qualification Score: {lead.qualification_score ?? 'N/A'}</p>
					<p>Email Invites Sent: {lead.email_invite_count || 0}</p>
					<button class="edit-button" on:click={() => editLead(lead.id)}> Edit </button>
					<button
						class="share-masked-lead-button"
						on:click={() => confirmDistrictVerified(lead)}
					>
						Share masked details with Verified Businesses in the district
					</button>
					<button
						class="share-masked-lead-button"
						on:click={() => confirmDistrictUnverified(lead)}
					>
						Share masked details with Unverified Businesses in the district
					</button>
					<button
						class="share-masked-lead-button"
						on:click={() => confirmStateVerified(lead)}
					>
						Share masked details with Verified Businesses in the State
					</button>
					<button
						class="whatsapp-reminder-button"
						on:click={() => openWhatsappModal(lead)}
					>
						WhatsApp Reminder
					</button>
					{#if !lead.district || lead.district.trim() === ''}
						<button
							class="pincode-mapping-button"
							on:click={() => openPincodeModal(lead)}
						>
							Add Pincode Mapping
						</button>
					{/if}
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
					<label>
						Qualification Score (0-10):
						<input type="number" bind:value={selectedLead.qualification_score} min="0" max="10" />
					</label>
					<div class="modal-buttons">
						<button type="button" on:click={cancelEdit}>Cancel</button>
						<button type="submit">Save</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- WhatsApp Reminder Modal -->
	{#if showWhatsappModal}
		<div class="modal-overlay" on:click={closeWhatsappModal}>
			<div class="modal-content" on:click|stopPropagation>
				<h2>Send WhatsApp Reminder</h2>
				<p class="modal-subtitle">Lead: {whatsappLead?.name} | District: {whatsappLead?.district}</p>
				{#if isLoadingBusinesses}
					<p>Loading businesses...</p>
				{:else if whatsappBusinesses.length === 0}
					<p>No businesses with WhatsApp numbers found in this district.</p>
				{:else}
					<div class="whatsapp-business-list">
						{#each whatsappBusinesses as business}
							{#if business.has_claimed}
								<span class="whatsapp-business-btn claimed">
									{business.businessname} ✓ Claimed
								</span>
							{:else}
								<button
									type="button"
									class="whatsapp-business-btn"
									on:click={() => openWhatsappLink(business)}
								>
									{business.businessname}
								</button>
							{/if}
						{/each}
					</div>
				{/if}
				<div class="modal-buttons">
					<button type="button" on:click={closeWhatsappModal}>Close</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Pincode Mapping Modal -->
	{#if showPincodeModal && pincodeLead}
		<div class="modal-overlay" on:click={closePincodeModal}>
			<div class="modal-content" on:click|stopPropagation>
				<h2>Add Pincode Mapping</h2>
				<p class="modal-subtitle">Pincode: <strong>{pincodeLead.pin_code}</strong> | Lead: {pincodeLead.name}</p>
				<form on:submit|preventDefault={savePincodeMapping}>
					<label>
						State:
						<select bind:value={pincodeState} on:change={onStateChange} required>
							<option value="">-- Select State --</option>
							{#each INDIAN_STATES as state}
								<option value={state}>{state}</option>
							{/each}
						</select>
					</label>
					<label>
						District:
						{#if isLoadingDistricts}
							<p>Loading districts...</p>
						{:else}
							<select bind:value={pincodeDistrict} required disabled={!pincodeState}>
								<option value="">-- Select District --</option>
								{#each availableDistricts as district}
									<option value={district}>{district}</option>
								{/each}
							</select>
						{/if}
					</label>
					<div class="modal-buttons">
						<button type="button" on:click={closePincodeModal} disabled={isSavingPincode}>Cancel</button>
						<button type="submit" disabled={isSavingPincode}>
							{isSavingPincode ? 'Saving...' : 'Save Mapping'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Confirmation Modal -->
	{#if showConfirmModal && confirmLead}
		<div class="modal-overlay" on:click={cancelConfirmation}>
			<div class="modal-content confirmation-modal" on:click|stopPropagation>
				<div class="confirmation-header">
					<h3>Confirm Action</h3>
				</div>
				<div class="confirmation-body">
					<div class="warning-icon">⚠️</div>
					<div class="confirmation-message">
						<p>{getConfirmationMessage(confirmActionType, confirmLead)}</p>
						<div class="lead-info">
							<strong>Lead:</strong> {confirmLead.name} (ID: {confirmLead.id})<br>
							<strong>District:</strong> {confirmLead.district}
						</div>
						<p class="warning-text">This will send emails to businesses. Make sure this is intended.</p>
					</div>
				</div>
				<div class="confirmation-actions">
					<button class="cancel-button" on:click={cancelConfirmation} disabled={isExecutingAction}>
						Cancel
					</button>
					<button class="confirm-button" on:click={executeConfirmedAction} disabled={isExecutingAction}>
						{isExecutingAction ? 'Sending Emails...' : 'Yes, Send Emails'}
					</button>
				</div>
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

	.light li.no-business-in-district {
		background-color: #fff3cd;
		border: 1px solid #ffc107;
	}

	/* Dark mode list item */
	.dark li {
		background-color: #333;
		border: 1px solid var(--dark-border-color);
	}

	.dark li.no-business-in-district {
		background-color: #4a3f2a;
		border: 1px solid #ffc107;
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

	.pincode-mapping-button {
		background-color: #ff9800;
		color: white;
	}

	.pincode-mapping-button:hover {
		background-color: #e68900;
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

	/* WhatsApp button */
	.whatsapp-reminder-button {
		background-color: #25d366;
		color: white;
	}

	.whatsapp-reminder-button:hover {
		background-color: #1da851;
	}

	.modal-subtitle {
		font-size: 0.9rem;
		margin-bottom: 1rem;
		color: #666;
	}

	.whatsapp-business-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: 50vh;
		overflow-y: auto;
	}

	.whatsapp-business-btn {
		display: block;
		padding: 0.75rem 1rem;
		background-color: #25d366;
		color: white;
		text-decoration: none;
		border-radius: 5px;
		font-weight: 500;
		text-align: center;
		transition: background-color 0.2s;
	}

	.whatsapp-business-btn:hover {
		background-color: #1da851;
	}

	.whatsapp-business-btn.claimed {
		background-color: #9ca3af;
		cursor: default;
		pointer-events: none;
	}

	/* Confirmation modal specific styles */
	.confirmation-modal {
		max-width: 450px;
		background: white;
	}

	.dark .confirmation-modal {
		background: #333;
		color: #f0f0f0;
	}

	.confirmation-header {
		text-align: center;
		border-bottom: 1px solid #e9ecef;
		padding-bottom: 1rem;
		margin-bottom: 1.5rem;
	}

	.dark .confirmation-header {
		border-bottom-color: #555;
	}

	.confirmation-header h3 {
		margin: 0;
		color: #dc3545;
		font-size: 1.3rem;
		font-weight: 600;
	}

	.dark .confirmation-header h3 {
		color: #ff6b6b;
	}

	.confirmation-body {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}

	.warning-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.confirmation-message {
		flex: 1;
	}

	.confirmation-message p {
		margin: 0 0 1rem 0;
		font-size: 1.1rem;
		font-weight: 500;
		color: #333;
	}

	.dark .confirmation-message p {
		color: #f0f0f0;
	}

	.lead-info {
		background-color: #f8f9fa;
		padding: 0.75rem;
		border-radius: 4px;
		margin: 1rem 0;
		font-size: 0.9rem;
		border-left: 3px solid #0056b3;
	}

	.dark .lead-info {
		background-color: #2a2a2a;
		border-left-color: #64b5f6;
	}

	.warning-text {
		font-size: 0.9rem !important;
		color: #dc3545 !important;
		font-style: italic;
		margin-top: 1rem;
		font-weight: 500;
	}

	.dark .warning-text {
		color: #ff6b6b !important;
	}

	.confirmation-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		border-top: 1px solid #e9ecef;
		padding-top: 1rem;
	}

	.dark .confirmation-actions {
		border-top-color: #555;
	}

	.cancel-button {
		background-color: #6c757d;
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		border-radius: 5px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.cancel-button:hover {
		background-color: #5a6268;
	}

	.confirm-button {
		background-color: #dc3545;
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		border-radius: 5px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.confirm-button:hover {
		background-color: #c82333;
	}

	/* Disabled states */
	.cancel-button:disabled,
	.confirm-button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.cancel-button:disabled:hover,
	.confirm-button:disabled:hover {
		background-color: #9ca3af;
	}

	/* Mobile responsiveness for confirmation modal */
	@media (max-width: 480px) {
		.confirmation-modal {
			margin: 1rem;
			max-width: calc(100vw - 2rem);
		}

		.confirmation-body {
			flex-direction: column;
			text-align: center;
		}

		.warning-icon {
			align-self: center;
		}

		.confirmation-actions {
			flex-direction: column;
		}

		.confirmation-actions button {
			width: 100%;
		}
	}
</style>
