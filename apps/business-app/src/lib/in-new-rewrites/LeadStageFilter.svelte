<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import {
		LEAD_CATEGORIES_WITH_ALL,
		STATUS_OPTIONS,
		getStagesMapForCategory
	} from '$lib/constants/lead';

	type LeadStageFilterProps = {
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

	function handleCategoryChange(value: string | undefined) {
		if (!value) return;
		selectedCategory = value;
		// Reset stage filter when category changes
		selectedStage = 'all';
		onFilterChange({ selectedCategory, selectedStage, selectedStatus });
	}

	function handleStageChange(value: string | undefined) {
		if (!value) return;
		selectedStage = value;
		onFilterChange({ selectedCategory, selectedStage, selectedStatus });
	}

	function handleStatusChange(value: string | undefined) {
		if (!value) return;
		selectedStatus = value;
		onFilterChange({ selectedCategory, selectedStage, selectedStatus });
	}

	function clearFilters() {
		selectedCategory = 'all';
		selectedStage = 'all';
		selectedStatus = 'all';
		onFilterChange({ selectedCategory, selectedStage, selectedStatus });
	}
</script>

<Card.Root class="mb-8 max-[480px]:p-4">
	<Card.Header class="max-md:flex-col max-md:items-stretch max-md:gap-4 flex-row items-center">
		<Card.Title class="flex-1 text-xl text-accent">Filter Customer Inquiries</Card.Title>
		<Button
			variant="secondary"
			size="sm"
			class="max-md:self-end max-[480px]:w-full"
			onclick={clearFilters}
		>
			Clear All Filters
		</Button>
	</Card.Header>

	<Card.Content class="space-y-4 md:space-y-0 md:flex md:gap-6 md:items-end md:flex-wrap">
		<div class="flex flex-col gap-2 flex-1 md:max-w-[200px]">
			<Label for="category-filter" class="font-semibold">Category:</Label>
			<Select.Root type="single" bind:value={selectedCategory} onValueChange={handleCategoryChange}>
				<Select.Trigger id="category-filter" class="w-full">
					{(LEAD_CATEGORIES_WITH_ALL as any)[selectedCategory] || 'Select category'}
				</Select.Trigger>
				<Select.Content>
					{#each Object.entries(LEAD_CATEGORIES_WITH_ALL) as [value, label]}
						<Select.Item {value}>{label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex flex-col gap-2 flex-1 md:max-w-[200px]">
			<Label for="stage-filter" class="font-semibold">Stage:</Label>
			<Select.Root type="single" bind:value={selectedStage} onValueChange={handleStageChange}>
				<Select.Trigger id="stage-filter" class="w-full">
					{(currentStages as any)[selectedStage] || 'Select stage'}
				</Select.Trigger>
				<Select.Content>
					{#each Object.entries(currentStages) as [value, label]}
						<Select.Item {value}>{label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex flex-col gap-2 flex-1 md:max-w-[200px]">
			<Label for="status-filter" class="font-semibold">Status:</Label>
			<Select.Root type="single" bind:value={selectedStatus} onValueChange={handleStatusChange}>
				<Select.Trigger id="status-filter" class="w-full">
					{(STATUS_OPTIONS as any)[selectedStatus] || 'Select status'}
				</Select.Trigger>
				<Select.Content>
					{#each Object.entries(STATUS_OPTIONS) as [value, label]}
						<Select.Item {value}>{label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</Card.Content>
</Card.Root>
