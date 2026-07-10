<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
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

	// My Leads mixes category 2 + 3; use generic STAGES_MAP
	const stagesMap = STAGES_MAP;

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

<Card.Root class="mb-6 max-[480px]:p-4">
	<Card.Header class="max-md:flex-col max-md:items-stretch max-md:gap-4 flex-row items-center">
		<Card.Title class="flex-1 text-base text-foreground">Filter</Card.Title>
		<Button
			variant="ghost"
			size="sm"
			class="max-md:self-end max-[480px]:w-full text-muted-foreground"
			onclick={clearFilters}
		>
			Clear
		</Button>
	</Card.Header>

	<Card.Content class="space-y-4 md:space-y-0 md:flex md:gap-6 md:items-end md:flex-wrap">
		<div class="flex flex-col gap-2 flex-1 md:max-w-[200px]">
			<Label for="stage-filter" class="font-semibold">Stage:</Label>
			<Select.Root type="single" bind:value={selectedStage} onValueChange={handleStageChange}>
				<Select.Trigger id="stage-filter" class="w-full">
					{(stagesMap as any)[selectedStage] || 'Select stage'}
				</Select.Trigger>
				<Select.Content>
					{#each Object.entries(stagesMap) as [value, label]}
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
