<script lang="ts">
	import { cn } from '$lib/utils';
	import {
		type LeadCategory,
		type LeadStage,
		EXCLUSIVE_STAGES,
		NON_EXCLUSIVE_CLAIMED_DISPLAY_STAGES,
		getDisplayStagesForCategory
	} from '$lib/constants/lead';

	let {
		currentStage = 0,
		leadCategory = 3, // 2 = Non-Exclusive-Claimed, 3 = Exclusive
		isActive = true // Prop to track if lead is active
	}: {
		currentStage?: LeadStage;
		leadCategory?: LeadCategory;
		isActive?: boolean;
	} = $props();

	// Get stages based on category using shared constants
	let stages = $derived(getDisplayStagesForCategory(leadCategory));

	// For non-exclusive claimed leads, adjust progress calculation to account for the extra display stage
	let progressPercentage = $derived(leadCategory === 2
		? ((currentStage + 1) / (stages.length - 1)) * 100
		: (currentStage / (stages.length - 1)) * 100);
</script>

<div class="w-full my-4 p-2">
	<!-- Progress Bar Track -->
	<div class="w-full h-1 bg-border rounded mb-4 relative overflow-hidden">
		<div
			class={cn(
				"h-full rounded transition-[width] duration-400 ease-out",
				isActive
					? "bg-gradient-to-r from-success to-success/80 shadow-success-glow"
					: "bg-gradient-to-r from-destructive to-destructive/80 shadow-destructive-glow"
			)}
			style="width: {progressPercentage}%"
		></div>
	</div>

	<!-- Stage Circles -->
	<div class="flex justify-between items-start relative max-[480px]:flex-nowrap max-[480px]:overflow-x-auto">
		{#each stages as stage, index}
			{@const isCompleted = leadCategory === 2 ? index <= currentStage : index < currentStage}
			{@const isCurrent = leadCategory === 2 ? index === currentStage + 1 : index === currentStage}
			{@const stageState = isCompleted || isCurrent ? (isActive ? 'active' : 'inactive') : 'future'}

			<div class="flex flex-col items-center flex-1 text-center relative max-[480px]:flex-[0_0_auto] max-[480px]:min-w-[70px]">
				<!-- Circle -->
				<div class={cn(
					"w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-all duration-300 border-[3px]",
					"max-md:w-9 max-md:h-9 max-md:text-[0.813rem] max-[480px]:w-8 max-[480px]:h-8 max-[480px]:text-xs",
					stageState === 'active' && "bg-success border-success text-white shadow-success-sm",
					stageState === 'inactive' && "bg-destructive border-destructive text-white shadow-destructive-sm",
					stageState === 'future' && "bg-background-secondary border-border text-muted-foreground"
				)}>
					<span class="font-bold font-mono">{index + 1}</span>
				</div>

				<!-- Label -->
				<div class={cn(
					"text-xs font-medium leading-tight mt-1.5 max-w-[85px] break-words hyphens-auto",
					"max-md:text-[0.688rem] max-md:max-w-[70px] max-[480px]:text-[0.625rem] max-[480px]:max-w-[65px] max-[480px]:leading-[1.2]",
					stageState === 'active' && "text-success font-semibold",
					stageState === 'inactive' && "text-destructive font-semibold",
					stageState === 'future' && "text-muted-foreground"
				)}>
					{stage}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	/* No component-specific styles needed - all styles are now in Tailwind */
</style>