<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import {
		LEAD_CATEGORIES_WITH_ALL,
		STATUS_OPTIONS,
		getStagesMapForCategory
	} from '$lib/constants/lead';

	export type LeadStageFilterProps = {
		selectedCategory?: string | number;
		selectedStage?: string | number;
		selectedStatus?: string;
		onFilterChange?: () => void;
	};

	let {
		selectedCategory = $bindable('all'),
		selectedStage = $bindable('all'),
		selectedStatus = $bindable('all'),
		onFilterChange
	}: LeadStageFilterProps = $props();

	// Get appropriate stages based on selected category
	let currentStages = $derived(getStagesMapForCategory(selectedCategory));

	function handleCategoryChange() {
		selectedStage = 'all';
		onFilterChange?.({ selectedCategory, selectedStage, selectedStatus });
	}

	function handleStageChange() {
		onFilterChange?.({ selectedCategory, selectedStage, selectedStatus });
	}

	function handleStatusChange() {
		onFilterChange?.({ selectedCategory, selectedStage, selectedStatus });
	}

	function clearFilters() {
		selectedCategory = 'all';
		selectedStage = 'all';
		selectedStatus = 'all';
		onFilterChange?.({ selectedCategory, selectedStage, selectedStatus });
	}
</script>

<Card.Root class="mb-8">
	<Card.Header class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
		<Card.Title class="text-xl">Filter Customer Inquiries</Card.Title>
		<Button variant="outline" size="sm" onclick={clearFilters}>Clear All Filters</Button>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col md:flex-row gap-6">
			<!-- Category Filter -->
			<div class="flex flex-col gap-2 flex-1">
				<Label for="category-filter">Category</Label>
				<Select.Root
					type="single"
					bind:value={selectedCategory}
					onValueChange={handleCategoryChange}
				>
					<Select.Trigger id="category-filter" class="w-full">
						{LEAD_CATEGORIES_WITH_ALL[selectedCategory] || 'Select category'}
					</Select.Trigger>
					<Select.Content>
						{#each Object.entries(LEAD_CATEGORIES_WITH_ALL) as [value, label]}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Stage Filter -->
			<div class="flex flex-col gap-2 flex-1">
				<Label for="stage-filter">Stage</Label>
				<Select.Root type="single" bind:value={selectedStage} onValueChange={handleStageChange}>
					<Select.Trigger id="stage-filter" class="w-full">
						{currentStages[selectedStage] || 'Select stage'}
					</Select.Trigger>
					<Select.Content>
						{#each Object.entries(currentStages) as [value, label]}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Status Filter -->
			<div class="flex flex-col gap-2 flex-1">
				<Label for="status-filter">Status</Label>
				<Select.Root type="single" bind:value={selectedStatus} onValueChange={handleStatusChange}>
					<Select.Trigger id="status-filter" class="w-full">
						{STATUS_OPTIONS[selectedStatus] || 'Select status'}
					</Select.Trigger>
					<Select.Content>
						{#each Object.entries(STATUS_OPTIONS) as [value, label]}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</Card.Content>
</Card.Root>
