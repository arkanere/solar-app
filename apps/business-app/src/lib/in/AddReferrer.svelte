<script>
	import { createEventDispatcher } from 'svelte';

	export let show = false;
	export let businessId;
	export let businessSlug;

	const dispatch = createEventDispatcher();

	// Form fields
	let name = '';
	let slug = '';
	let email = '';
	let phone = '';
	let notes = '';
	let isSubmitting = false;
	let errorMessage = '';
	let successMessage = '';

	// Handle form submission
	async function handleSubmit() {
		errorMessage = '';
		successMessage = '';

		if (!name || !slug || !phone) {
			errorMessage = 'Please enter name, slug, and phone number';
			return;
		}

		// Validate slug format (alphanumeric and hyphens only)
		const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		if (!slugRegex.test(slug)) {
			errorMessage = 'Slug must be lowercase alphanumeric characters and hyphens only (e.g., john-doe)';
			return;
		}

		// Validate phone number (basic validation)
		const phoneRegex = /^[6-9]\d{9}$/;
		if (!phoneRegex.test(phone)) {
			errorMessage = 'Please enter a valid 10-digit phone number';
			return;
		}

		// Validate email if provided
		if (email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				errorMessage = 'Please enter a valid email address';
				return;
			}
		}

		isSubmitting = true;

		try {
			const response = await fetch('/in/api/addReferrer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					businessId,
					name,
					slug,
					email,
					phone,
					notes
				})
			});

			const result = await response.json();

			if (result.success) {
				successMessage = 'Referrer added successfully!';
				// Reset form
				name = '';
				slug = '';
				email = '';
				phone = '';
				notes = '';

				// Notify parent component
				dispatch('referrerAdded', result.referrer);

				// Close modal after short delay
				setTimeout(() => {
					closeModal();
					window.location.reload();
				}, 1500);
			} else {
				errorMessage = result.error || 'Failed to add referrer';
			}
		} catch (error) {
			console.error('Error adding referrer:', error);
			errorMessage = 'An error occurred while adding the referrer';
		} finally {
			isSubmitting = false;
		}
	}

	function closeModal() {
		// Reset form
		name = '';
		slug = '';
		email = '';
		phone = '';
		notes = '';
		errorMessage = '';
		successMessage = '';
		dispatch('close');
	}
</script>

{#if show}
	<div
		class="modal-backdrop"
		role="button"
		tabindex="0"
		on:click={(e) => e.target === e.currentTarget && closeModal()}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div class="modal">
			<div class="modal-header">
				<h2>Add New Referrer</h2>
				<button class="close-btn" on:click={closeModal}>&times;</button>
			</div>

			<div class="modal-body">
				{#if errorMessage}
					<div class="error-message">{errorMessage}</div>
				{/if}

				{#if successMessage}
					<div class="success-message">{successMessage}</div>
				{/if}

				<form on:submit|preventDefault={handleSubmit}>
					<!-- Name Field -->
					<div class="form-group">
						<label for="name">Name <span class="required">*</span></label>
						<input
							type="text"
							id="name"
							bind:value={name}
							placeholder="Enter referrer name"
							required
						/>
					</div>

					<!-- Slug Field -->
					<div class="form-group">
						<label for="slug">Slug <span class="required">*</span></label>
						<input
							type="text"
							id="slug"
							bind:value={slug}
							placeholder="e.g., john-doe or agent-123"
							pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
							required
						/>
						<small class="help-text">Lowercase letters, numbers, and hyphens only. This will be used in the referrer URL.</small>
					</div>

					<!-- Phone Field -->
					<div class="form-group">
						<label for="phone">Phone Number <span class="required">*</span></label>
						<input
							type="tel"
							id="phone"
							bind:value={phone}
							placeholder="Enter 10-digit phone number"
							maxlength="10"
							required
						/>
					</div>

					<!-- Email Field -->
					<div class="form-group">
						<label for="email">Email</label>
						<input type="email" id="email" bind:value={email} placeholder="Enter email address" />
					</div>

					<!-- Notes Field -->
					<div class="form-group">
						<label for="notes">Notes</label>
						<textarea
							id="notes"
							bind:value={notes}
							placeholder="Add any notes about this referrer"
							rows="3"
						></textarea>
					</div>

					<div class="form-actions">
						<button type="button" class="btn-cancel" on:click={closeModal} disabled={isSubmitting}
							>Cancel</button
						>
						<button type="submit" class="btn-submit" disabled={isSubmitting}>
							{isSubmitting ? 'Adding...' : 'Add Referrer'}
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
		border-radius: 8px;
		width: 90%;
		max-width: 500px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #0056b3;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #666;
		line-height: 1;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		color: #333;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-size: 0.95rem;
		color: #333;
	}

	.required {
		color: #dc3545;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.65rem;
		border: 1px solid #ddd;
		border-radius: 5px;
		font-size: 0.95rem;
		font-family: inherit;
		box-sizing: border-box;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #0056b3;
	}

	.form-group textarea {
		resize: vertical;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	button {
		padding: 0.65rem 1.25rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 500;
		transition: background-color 0.3s ease;
	}

	.btn-cancel {
		background-color: #6c757d;
		color: white;
	}

	.btn-cancel:hover:not(:disabled) {
		background-color: #5a6268;
	}

	.btn-submit {
		background-color: #0056b3;
		color: white;
	}

	.btn-submit:hover:not(:disabled) {
		background-color: #00449e;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-message {
		color: #d32f2f;
		margin-bottom: 1rem;
		padding: 0.75rem;
		background-color: #ffebee;
		border-radius: 5px;
		font-size: 0.9rem;
	}

	.success-message {
		color: #2e7d32;
		margin-bottom: 1rem;
		padding: 0.75rem;
		background-color: #e8f5e9;
		border-radius: 5px;
		font-size: 0.9rem;
	}

	.help-text {
		display: block;
		margin-top: 0.25rem;
		font-size: 0.85rem;
		color: #666;
		font-style: italic;
	}

	@media (max-width: 768px) {
		.modal {
			width: 95%;
			max-height: 95vh;
		}

		.modal-header,
		.modal-body {
			padding: 1rem;
		}

		.form-actions {
			flex-direction: column;
		}

		button {
			width: 100%;
		}
	}
</style>
