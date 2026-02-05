<script>
	export let show = false;
	export let businessInfo = {};
	export let businessSlug = '';

	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	const dispatch = createEventDispatcher();

	// Create a local copy of the business info that we can modify
	let formData = {
		id: '',
		businessname: '',
		description: '',
		phonenumber: '',
		whatsapp: '',
		email: '',
		address: '',
		website: '',
		instagram_id: '',
		google_maps_link: ''
	};

	// Reset the form data whenever the modal is shown or businessInfo changes
	$: if (show) {
		resetForm();
	}

	$: if (businessInfo && Object.keys(businessInfo).length > 0) {
		// Only update if businessInfo actually has values
		if (show) resetForm();
	}

	function resetForm() {
		// Create a fresh copy of the business info
		formData = {
			id: businessInfo.id || '',
			businessname: businessInfo.businessname || '',
			description: businessInfo.description || '',
			phonenumber: businessInfo.phonenumber || '',
			whatsapp: businessInfo.whatsapp || '',
			email: businessInfo.email || '',
			address: businessInfo.address || '',
			website: businessInfo.website || '',
			instagram_id: businessInfo.instagram_id || '',
			google_maps_link: businessInfo.google_maps_link || ''
		};
	}

	const close = () => {
		show = false;
		dispatch('close');
	};

	const saveProfile = async () => {
		try {
			const response = await fetch(`/api/updateBusinessDetails`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					business_slug: businessSlug
				})
			});

			const result = await response.json();
			if (result.success) {
				alert('Profile updated successfully!');
				dispatch('updated', formData);
			} else {
				throw new Error('Failed to update profile');
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			alert('An error occurred while updating the profile');
		} finally {
			close();
		}
	};

	// For debugging
	afterUpdate(() => {
		console.log('Component updated', { formData, show, businessInfo });
	});
</script>

{#if show}
	<div role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" class="modal-overlay">
		<div class="modal">
			<button class="close-modal" aria-label="Close dialog" on:click={close}>&times;</button>
			<form class="modal-content" on:submit|preventDefault={saveProfile}>
				<h2 id="edit-profile-title">Edit Profile</h2>

				<label for="businessname">Business Name:</label>
				<input id="businessname" bind:value={formData.businessname} required />

				<label for="description">Description:</label>
				<textarea id="description" bind:value={formData.description}></textarea>

				<label for="phonenumber">Phone Number:</label>
				<input id="phonenumber" bind:value={formData.phonenumber} />

				<label for="whatsapp">WhatsApp Number:</label>
				<input id="whatsapp" bind:value={formData.whatsapp} placeholder="e.g., +919876543210" />

				<label for="email">Business Email:</label>
				<input id="email" type="email" bind:value={formData.email} />

				<label for="address">Address:</label>
				<input id="address" bind:value={formData.address} />

				<label for="website">Website:</label>
				<input id="website" bind:value={formData.website} />

				<label for="instagram_id">Instagram ID:</label>
				<input
					id="instagram_id"
					bind:value={formData.instagram_id}
					placeholder="e.g., @your_business_handle"
				/>

				<label for="google_maps_link">Google Maps Link:</label>
				<input
					id="google_maps_link"
					bind:value={formData.google_maps_link}
					placeholder="e.g., https://maps.google.com/..."
				/>

				<div class="modal-buttons">
					<button type="submit">Update</button>
					<button type="button" on:click={close}>Cancel</button>
				</div>
			</form>
		</div>
		<button class="modal-backdrop" on:click={close} aria-label="Close dialog"></button>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		border: none;
		cursor: default;
		z-index: -1;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-start;
		z-index: 1000;
		overflow-y: auto;
		padding: 20px 0;
	}

	.modal {
		position: relative;
		z-index: 1001;
		background: white;
		padding: 20px;
		border-radius: 5px;
		max-width: 500px;
		width: 100%;
		margin: auto 20px;
		max-height: calc(100vh - 40px);
		overflow-y: auto;
	}

	.close-modal {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	label {
		font-weight: bold;
	}

	input,
	textarea {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	textarea {
		min-height: 100px;
		resize: vertical;
	}

	.modal-buttons {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
		margin-top: 20px;
	}

	button {
		padding: 8px 16px;
		border-radius: 4px;
		cursor: pointer;
	}

	button[type='submit'] {
		background-color: #4caf50;
		color: white;
		border: none;
	}

	button[type='button'] {
		background-color: #f1f1f1;
		border: 1px solid #ccc;
	}
</style>
