<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import {
		LEAD_CATEGORIES_WITH_ALL,
		STAGES_MAP,
		NON_EXCLUSIVE_CLAIMED_STAGES_MAP,
		STATUS_OPTIONS,
		getStagesMapForCategory
	} from '$lib/constants/lead';

	export type LeadStageFilterProps = {
		selectedCategory?: string;
		selectedStage?: string;
		selectedStatus?: string;
		onFilterChange?: (filters: {
			selectedCategory: string;
			selectedStage: string;
			selectedStatus: string;
		}) => void;
	};

	let {
		selectedCategory = $bindable('all'),
		selectedStage = $bindable('all'),
		selectedStatus = $bindable('all'),
		onFilterChange = () => {}
	}: LeadStageFilterProps = $props();

	// Get appropriate stages based on selected category
	let currentStages = $derived(getStagesMapForCategory(selectedCategory));

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
	<div
		class="flex justify-between items-center mb-4 max-md:flex-col max-md:items-stretch max-md:gap-4"
	>
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
			<select
				id="category-filter"
				bind:value={selectedCategory}
				onchange={handleCategoryChange}
				class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
			>
				{#each Object.entries(LEAD_CATEGORIES_WITH_ALL) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-col gap-2 flex-1 max-w-[200px] max-md:max-w-full max-md:flex-none">
			<Label for="stage-filter" class="font-semibold">Stage:</Label>
			<select
				id="stage-filter"
				bind:value={selectedStage}
				onchange={handleStageChange}
				class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
			>
				{#each Object.entries(currentStages) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-col gap-2 flex-1 max-w-[200px] max-md:max-w-full max-md:flex-none">
			<Label for="status-filter" class="font-semibold">Status:</Label>
			<select
				id="status-filter"
				bind:value={selectedStatus}
				onchange={handleStatusChange}
				class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
			>
				{#each Object.entries(STATUS_OPTIONS) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<style>
	/* No component-specific styles needed - all styles are now in Tailwind */
</style>
