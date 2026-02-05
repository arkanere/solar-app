<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let selectedCategory = 'all';
	export let selectedStage = 'all';
	export let selectedStatus = 'all';

	// Lead categories
	const CATEGORIES = {
		all: 'All Categories',
		1: 'Non-Exclusive-Available',
		2: 'Non-Exclusive-Claimed',
		3: 'Exclusive'
	};

	// Lead stages (regular)
	const STAGES = {
		all: 'All Stages',
		0: 'New Inquiry',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	// Lead stages for Non-Exclusive-Claimed
	const NON_EXCLUSIVE_CLAIMED_STAGES = {
		all: 'All Stages',
		0: 'Claimed',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	// Status options
	const STATUS_OPTIONS = {
		all: 'All Status',
		true: 'Active',
		false: 'Inactive'
	};

	// Get appropriate stages based on selected category
	$: currentStages = selectedCategory === '2' ? NON_EXCLUSIVE_CLAIMED_STAGES : STAGES;

	function handleCategoryChange() {
		// Reset stage filter when category changes
		selectedStage = 'all';
		dispatch('filterChange', { selectedCategory, selectedStage, selectedStatus });
	}

	function handleStageChange() {
		dispatch('filterChange', { selectedCategory, selectedStage, selectedStatus });
	}

	function handleStatusChange() {
		dispatch('filterChange', { selectedCategory, selectedStage, selectedStatus });
	}

	function clearFilters() {
		selectedCategory = 'all';
		selectedStage = 'all';
		selectedStatus = 'all';
		dispatch('filterChange', { selectedCategory, selectedStage, selectedStatus });
	}
</script>

<div class="filter-container">
	<div class="filter-header">
		<h3>Filter Customer Inquiries</h3>
		<button class="clear-filters-btn" on:click={clearFilters}>Clear All Filters</button>
	</div>

	<div class="filter-controls">
		<div class="filter-group">
			<label for="category-filter">Category:</label>
			<select id="category-filter" bind:value={selectedCategory} on:change={handleCategoryChange}>
				{#each Object.entries(CATEGORIES) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>

		<div class="filter-group">
			<label for="stage-filter">Stage:</label>
			<select id="stage-filter" bind:value={selectedStage} on:change={handleStageChange}>
				{#each Object.entries(currentStages) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>

		<div class="filter-group">
			<label for="status-filter">Status:</label>
			<select id="status-filter" bind:value={selectedStatus} on:change={handleStatusChange}>
				{#each Object.entries(STATUS_OPTIONS) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<style>
	.filter-container {
		margin-bottom: 2rem;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	:global(.light) .filter-container {
		background-color: #fff;
		border: 1px solid var(--border-color-light);
	}

	:global(.dark) .filter-container {
		background-color: #333;
		border: 1px solid var(--border-color-dark);
	}

	.filter-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.filter-header h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--accent-color);
	}

	.clear-filters-btn {
		background-color: #6c757d;
		color: white;
		border: none;
		padding: 0.4rem 0.8rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: background-color 0.3s ease;
	}

	.clear-filters-btn:hover {
		background-color: #5a6268;
	}

	.filter-controls {
		display: flex;
		gap: 1.5rem;
		align-items: end;
		flex-wrap: wrap;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0; /* Remove fixed min-width */
		flex: 1;
		max-width: 200px;
	}

	.filter-group label {
		font-weight: 600;
		font-size: 0.9rem;
	}

	:global(.light) .filter-group label {
		color: var(--light-primary-text-color);
	}

	:global(.dark) .filter-group label {
		color: var(--dark-primary-text-color);
	}

	.filter-group select {
		padding: 0.5rem;
		border: 1px solid var(--border-color-light);
		border-radius: 4px;
		font-size: 0.9rem;
		background-color: #fff;
		cursor: pointer;
		transition: border-color 0.3s ease;
		width: 100%;
		min-width: 0;
	}

	.filter-group select:focus {
		outline: none;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.2);
	}

	:global(.dark) .filter-group select {
		background-color: #333;
		border-color: var(--border-color-dark);
		color: var(--dark-primary-text-color);
	}

	:global(.dark) .filter-group select:focus {
		border-color: #64b5f6;
		box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2);
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.filter-header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.filter-controls {
			flex-direction: column;
			gap: 1rem;
		}

		.filter-group {
			min-width: 0;
			max-width: 100%;
			flex: none;
		}

		.clear-filters-btn {
			align-self: flex-end;
			width: auto;
		}
	}

	@media (max-width: 480px) {
		.filter-container {
			padding: 1rem;
			margin-left: 0;
			margin-right: 0;
		}

		.filter-controls {
			gap: 0.75rem;
		}

		.filter-group select {
			padding: 0.4rem;
			font-size: 0.85rem;
		}

		.clear-filters-btn {
			width: 100%;
			font-size: 0.8rem;
		}
	}
</style>
