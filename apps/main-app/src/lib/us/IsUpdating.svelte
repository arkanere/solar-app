<script>
	export let show = false;
	export let lead = null;
	export let stages = {
		0: 'New Inquiry',
		1: 'Qualified',
		2: 'Proposal Sent',
		3: 'Won'
	};

	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	// Create a local copy of the lead to avoid direct binding issues
	let localLead = null;

	// Define different stage options based on lead category
	const nonExclusiveClaimedStages = {
		0: 'Claimed',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	// Get appropriate stages based on lead category
	$: currentStages = localLead && localLead.category === 2 ? nonExclusiveClaimedStages : stages;

	$: if (lead) {
		// Ensure stage is a number when initializing the form
		localLead = {
			...lead,
			stage: typeof lead.stage === 'number' ? lead.stage : Number(lead.stage)
		};
	}

	const close = () => {
		show = false;
		dispatch('close');
	};

	const saveUpdate = async () => {
		try {
			const response = await fetch('/us/api/updateLeadByBusiness', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: localLead.id,
					stage: Number(localLead.stage), // Ensure stage is sent as a number
					status: localLead.status
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update lead');
			}

			const result = await response.json();

			alert('Lead updated successfully!');
			dispatch('updated', result.lead);
			close();
		} catch (error) {
			console.error(error);
			alert('An error occurred while updating the lead.');
		}
	};
</script>

{#if show && localLead}
	<div role="dialog" aria-modal="true" aria-labelledby="update-lead-title" class="modal-overlay">
		<div class="modal">
			<button class="close-modal" aria-label="Close dialog" on:click={close}>&times;</button>
			<div class="modal-content">
				<h2 id="update-lead-title">Update Lead</h2>
				<form on:submit|preventDefault={saveUpdate}>
					<div class="form-group">
						<label for="lead-stage">Stage:</label>
						<select id="lead-stage" bind:value={localLead.stage}>
							{#each Object.entries(currentStages) as [value, label]}
								<option value={Number(value)}>{label}</option>
							{/each}
						</select>
					</div>

					<div class="form-group">
						<label for="lead-status">Status:</label>
						<select id="lead-status" bind:value={localLead.status}>
							<option value={true}>Active</option>
							<option value={false}>Inactive</option>
						</select>
					</div>

					<div class="modal-buttons">
						<button type="button" on:click={close}>Cancel</button>
						<button type="submit">Save</button>
					</div>
				</form>
			</div>
		</div>
		<!-- Use a button with fixed position and full coverage to handle outside clicks -->
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
		align-items: center;
		z-index: 1000;
	}

	.modal {
		position: relative;
		z-index: 1001;
		background: white;
		padding: 20px;
		border-radius: 5px;
		max-width: 500px;
		width: 100%;
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

	.form-group {
		display: flex;
		flex-direction: column;
		margin-bottom: 15px;
	}

	label {
		font-weight: bold;
		margin-bottom: 5px;
	}

	select {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-bottom: 5px;
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
