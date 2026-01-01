<script lang="ts">
	import { cn } from '$lib/utils';

	type Stage = 'new' | 'contacted' | 'proposal' | 'won' | 'lost';
	type StageConfig = {
		label: string;
		colorClass: string;
		bgClass: string;
		borderClass: string;
	};

	let {
		currentStage,
		stages = ['new', 'contacted', 'proposal', 'won'] as Stage[],
		isActive = true,
		size = 'default',
		class: className = ''
	}: {
		currentStage: Stage;
		stages?: Stage[];
		isActive?: boolean;
		size?: 'sm' | 'default' | 'lg';
		class?: string;
	} = $props();

	const stageConfig: Record<Stage, StageConfig> = {
		new: {
			label: 'New',
			colorClass: 'text-stage-new',
			bgClass: 'bg-stage-new',
			borderClass: 'border-stage-new'
		},
		contacted: {
			label: 'Contacted',
			colorClass: 'text-stage-contacted',
			bgClass: 'bg-stage-contacted',
			borderClass: 'border-stage-contacted'
		},
		proposal: {
			label: 'Proposal',
			colorClass: 'text-stage-proposal',
			bgClass: 'bg-stage-proposal',
			borderClass: 'border-stage-proposal'
		},
		won: {
			label: 'Won',
			colorClass: 'text-stage-won',
			bgClass: 'bg-stage-won',
			borderClass: 'border-stage-won'
		},
		lost: {
			label: 'Lost',
			colorClass: 'text-stage-lost',
			bgClass: 'bg-stage-lost',
			borderClass: 'border-stage-lost'
		}
	};

	const sizeClasses = {
		sm: {
			circle: 'w-8 h-8 text-xs',
			line: 'w-8 h-0.5',
			label: 'text-[0.625rem] max-w-[50px]'
		},
		default: {
			circle: 'w-10 h-10 text-sm',
			line: 'w-12 h-1',
			label: 'text-xs max-w-[70px]'
		},
		lg: {
			circle: 'w-12 h-12 text-base',
			line: 'w-16 h-1',
			label: 'text-sm max-w-[90px]'
		}
	};

	let currentStageIndex = $derived(stages.indexOf(currentStage));
	let sizeClass = $derived(sizeClasses[size]);
</script>

<div class={cn('flex items-start', className)} data-slot="stage-indicator">
	{#each stages as stage, index}
		{@const isCompleted = index < currentStageIndex}
		{@const isCurrent = index === currentStageIndex}
		{@const config = stageConfig[stage]}
		{@const stageState = isCompleted || isCurrent ? (isActive ? 'active' : 'inactive') : 'future'}

		<div class="flex items-center">
			<div class="flex flex-col items-center">
				<!-- Stage circle -->
				<div
					class={cn(
						'rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-300',
						sizeClass.circle,
						stageState === 'active' && cn(config.bgClass, config.borderClass, 'text-white shadow-success-sm'),
						stageState === 'inactive' && 'bg-destructive border-destructive text-white shadow-destructive-sm',
						stageState === 'future' && 'bg-background-secondary border-border text-muted-foreground'
					)}
				>
					<span class="font-bold font-mono">{index + 1}</span>
				</div>

				<!-- Stage label -->
				<div
					class={cn(
						'font-medium leading-tight mt-1.5 text-center break-words hyphens-auto',
						sizeClass.label,
						stageState === 'active' && cn(config.colorClass, 'font-semibold'),
						stageState === 'inactive' && 'text-destructive font-semibold',
						stageState === 'future' && 'text-muted-foreground'
					)}
				>
					{config.label}
				</div>
			</div>

			<!-- Connecting line (except last) -->
			{#if index < stages.length - 1}
				<div
					class={cn(
						'mx-2 rounded self-start mt-4',
						sizeClass.line,
						index < currentStageIndex
							? isActive ? config.bgClass : 'bg-destructive'
							: 'bg-border'
					)}
				></div>
			{/if}
		</div>
	{/each}
</div>
