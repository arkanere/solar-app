<script lang="ts">
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { Check } from '@lucide/svelte';
	import {
		getDisplayStagesForCategory,
		type LeadCategory
	} from '$lib/constants/lead';

	let { currentStage = 0, leadCategory = 3, isActive = true } = $props<{
		currentStage?: number;
		leadCategory?: LeadCategory;
		isActive?: boolean;
	}>();

	let stages = $derived(getDisplayStagesForCategory(leadCategory));

	let progressPercentage = $derived(
		leadCategory === 2
			? ((currentStage + 1) / (stages.length - 1)) * 100
			: (currentStage / (stages.length - 1)) * 100
	);

	function getStageState(index: number): 'completed' | 'current' | 'future' {
		if (leadCategory === 2) {
			if (index < currentStage) return 'completed';
			if (index === currentStage + 1) return 'current';
			return 'future';
		}
		if (index < currentStage) return 'completed';
		if (index === currentStage) return 'current';
		return 'future';
	}
</script>

<div class="w-full space-y-3 py-2">
	<Progress
		value={progressPercentage}
		class={isActive
			? 'bg-success-muted [&>[data-slot=progress-indicator]]:bg-success'
			: 'bg-destructive-muted [&>[data-slot=progress-indicator]]:bg-destructive'}
	/>

	<div class="flex justify-between items-start">
		{#each stages as stage, index}
			{@const state = getStageState(index)}
			{@const stateColors = {
				completed: isActive ? 'bg-success border-success text-success-foreground' : 'bg-destructive border-destructive text-destructive-foreground',
				current: isActive ? 'bg-success border-success text-success-foreground' : 'bg-destructive border-destructive text-destructive-foreground',
				future: 'bg-secondary border-border text-muted-foreground'
			}}
			{@const labelColors = {
				completed: isActive ? 'text-success' : 'text-destructive',
				current: isActive ? 'text-success font-semibold' : 'text-destructive font-semibold',
				future: 'text-muted-foreground'
			}}

			<div class="flex flex-col items-center flex-1 text-center">
				<div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold mb-2 transition-all {stateColors[state]}">
					{#if state === 'completed'}
						<Check size={16} />
					{:else}
						{index + 1}
					{/if}
				</div>
				<div class="text-xs leading-tight max-w-[80px] md:max-w-[100px] break-words hyphens-auto {labelColors[state]}">
					{stage}
				</div>
			</div>
		{/each}
	</div>
</div>
