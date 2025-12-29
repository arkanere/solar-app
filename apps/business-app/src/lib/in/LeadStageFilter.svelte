<script>
	import { Button } from '$lib/components/ui/button';
	import { Select } from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';

	let {
		selectedCategory = $bindable('all'),
		selectedStage = $bindable('all'),
		selectedStatus = $bindable('all'),
		onFilterChange = () => {}
	} = $props();

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
	let currentStages = $derived(selectedCategory === '2' ? NON_EXCLUSIVE_CLAIMED_STAGES : STAGES);

	function handleCategoryChange() {
		// Reset stage filter when category changes
		selectedStage = 'all';
		onFilterChange({ selectedCategory, selectedStage, selectedStatus });
	}

	function handleStageChange() {
		onFilterChange({ selectedCategory, selectedStage, selectedStatus });
	}

	function handleStatusChange() {
		onFilterChange({ selectedCategory, selectedStage, selectedStatus });
	}

	function clearFilters() {
		selectedCategory = 'all';
		selectedStage = 'all';
		selectedStatus = 'all';
		onFilterChange({ selectedCategory, selectedStage, selectedStatus });
	}
</script>

<div class="mb-8 p-6 rounded-lg shadow-sm bg-card border border-border max-[480px]:p-4">
	<!-- Header -->
	<div class="flex justify-between items-center mb-4 max-md:flex-col max-md:items-stretch max-md:gap-4">
		<h3 class="m-0 text-xl font-semibold text-accent">Filter Customer Inquiries</h3>
		<Button
			variant="secondary"
			size="sm"
			class="max-md:self-end max-[480px]:w-full"
			onclick={clearFilters}
		>
			Clear All Filters
		</Button>
	</div>

	<!-- Filter Controls -->
	<div class="flex gap-6 items-end flex-wrap max-md:flex-col max-md:gap-4 max-[480px]:gap-3">
		<div class="flex flex-col gap-2 flex-1 max-w-[200px] max-md:max-w-full max-md:flex-none">
			<Label for="category-filter" class="font-semibold">Category:</Label>
			<Select
				id="category-filter"
				bind:value={selectedCategory}
				onchange={handleCategoryChange}
				class="w-full"
			>
				{#each Object.entries(CATEGORIES) as [value, label]}
					<option value={value}>{label}</option>
				{/each}
			</Select>
		</div>

		<div class="flex flex-col gap-2 flex-1 max-w-[200px] max-md:max-w-full max-md:flex-none">
			<Label for="stage-filter" class="font-semibold">Stage:</Label>
			<Select
				id="stage-filter"
				bind:value={selectedStage}
				onchange={handleStageChange}
				class="w-full"
			>
				{#each Object.entries(currentStages) as [value, label]}
					<option value={value}>{label}</option>
				{/each}
			</Select>
		</div>

		<div class="flex flex-col gap-2 flex-1 max-w-[200px] max-md:max-w-full max-md:flex-none">
			<Label for="status-filter" class="font-semibold">Status:</Label>
			<Select
				id="status-filter"
				bind:value={selectedStatus}
				onchange={handleStatusChange}
				class="w-full"
			>
				{#each Object.entries(STATUS_OPTIONS) as [value, label]}
					<option value={value}>{label}</option>
				{/each}
			</Select>
		</div>
	</div>
</div>

<style>
	/* No component-specific styles needed - all styles are now in Tailwind */
</style>