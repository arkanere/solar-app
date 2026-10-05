<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { STAGES_MAP, STATUS_OPTIONS } from '$lib/constants/lead';

	type LeadStageFilterProps = {
		selectedStage?: string;
		selectedStatus?: string;
		onFilterChange?: (filters: { selectedStage: string; selectedStatus: string }) => void;
	};

	let {
		selectedStage = $bindable('all'),
		selectedStatus = $bindable('all'),
		onFilterChange = () => {}
	}: LeadStageFilterProps = $props();

	// My Leads mixes category 2 + 3; use generic STAGES_MAP. Won leads have
	// their own tab, so Won is not offered here.
	const { 3: _won, ...stagesMap } = STAGES_MAP;

	function handleStageChange(value: string | undefined) {
		if (!value) return;
		selectedStage = value;
		onFilterChange({ selectedStage, selectedStatus });
	}

	function handleStatusChange(value: string | undefined) {
		if (!value) return;
		selectedStatus = value;
		onFilterChange({ selectedStage, selectedStatus });
	}

	function clearFilters() {
		selectedStage = 'all';
		selectedStatus = 'all';
		onFilterChange({ selectedStage, selectedStatus });
	}
</script>

<div class="flex items-center gap-2 flex-wrap">
	<Label for="stage-filter" class="sr-only">Stage</Label>
	<Select.Root type="single" bind:value={selectedStage} onValueChange={handleStageChange}>
		<Select.Trigger id="stage-filter" size="sm" class="w-40">
			{(stagesMap as any)[selectedStage] || 'Select stage'}
		</Select.Trigger>
		<Select.Content>
			{#each Object.entries(stagesMap) as [value, label]}
				<Select.Item {value}>{label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<Label for="status-filter" class="sr-only">Status</Label>
	<Select.Root type="single" bind:value={selectedStatus} onValueChange={handleStatusChange}>
		<Select.Trigger id="status-filter" size="sm" class="w-36">
			{(STATUS_OPTIONS as any)[selectedStatus] || 'Select status'}
		</Select.Trigger>
		<Select.Content>
			{#each Object.entries(STATUS_OPTIONS) as [value, label]}
				<Select.Item {value}>{label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	{#if selectedStage !== 'all' || selectedStatus !== 'all'}
		<Button variant="ghost" size="sm" class="text-muted-foreground" onclick={clearFilters}>
			Clear
		</Button>
	{/if}
</div>
