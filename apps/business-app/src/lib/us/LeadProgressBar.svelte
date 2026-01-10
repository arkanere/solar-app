<script lang="ts">
	import {
		EXCLUSIVE_STAGES,
		NON_EXCLUSIVE_CLAIMED_DISPLAY_STAGES,
		getDisplayStagesForCategory,
		type LeadCategory
	} from '$lib/constants/lead';

	let { currentStage = 0, leadCategory = 3, isActive = true } = $props<{
		currentStage?: number;
		leadCategory?: LeadCategory;
		isActive?: boolean;
	}>();

	let stages = $derived(getDisplayStagesForCategory(leadCategory));

	// For non-exclusive claimed leads, adjust progress calculation to account for the extra display stage
	let progressPercentage = $derived(
		leadCategory === 2
			? ((currentStage + 1) / (stages.length - 1)) * 100
			: (currentStage / (stages.length - 1)) * 100
	);

	let progressColor = $derived(isActive ? 'active' : 'inactive');
</script>

<div class="progress-container">
	<div class="progress-bar">
		<div class="progress-fill {progressColor}" style="width: {progressPercentage}%"></div>
	</div>
	<div class="progress-stages">
		{#each stages as stage, index}
			{@const adjustedIndex = leadCategory === 2 ? index - 1 : index}
			{@const isCompleted = leadCategory === 2 ? index <= currentStage : index < currentStage}
			{@const isCurrent = leadCategory === 2 ? index === currentStage + 1 : index === currentStage}
			{@const isFuture = leadCategory === 2 ? index > currentStage + 1 : index > currentStage}

			<div class="stage-item {isCompleted ? progressColor : isCurrent ? progressColor : 'future'}">
				<div class="stage-circle">
					{#if isCompleted && !isCurrent}
						<span class="checkmark">{index + 1}</span>
					{:else if isCurrent}
						<span class="current-stage">{index + 1}</span>
					{:else}
						<span class="future-stage">{index + 1}</span>
					{/if}
				</div>
				<div class="stage-label">{stage}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.progress-container {
		width: 100%;
		margin: 1rem 0;
		padding: 0.5rem;
	}

	.progress-bar {
		width: 100%;
		height: 2px;
		background-color: #e0e0e0;
		border-radius: 1px;
		margin-bottom: 0.75rem;
		position: relative;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 2px;
		transition:
			width 0.3s ease,
			background 0.3s ease;
	}

	.progress-fill.active {
		background: linear-gradient(90deg, #4caf50 0%, #2e7d32 100%);
	}

	.progress-fill.inactive {
		background: linear-gradient(90deg, #f44336 0%, #d32f2f 100%);
	}

	.progress-stages {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		position: relative;
	}

	.stage-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		text-align: center;
		position: relative;
	}

	.stage-circle {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 0.8rem;
		margin-bottom: 0.5rem;
		transition: all 0.3s ease;
		border: 2px solid;
	}

	.stage-item.active .stage-circle {
		background-color: #4caf50;
		border-color: #4caf50;
		color: white;
	}

	.stage-item.inactive .stage-circle {
		background-color: #f44336;
		border-color: #f44336;
		color: white;
	}

	.stage-item.future .stage-circle {
		background-color: #f5f5f5;
		border-color: #e0e0e0;
		color: #999;
	}

	.checkmark {
		font-size: 0.8rem;
		font-weight: bold;
		font-family: monospace;
	}

	.current-stage {
		font-weight: bold;
		font-family: monospace;
	}

	.future-stage {
		color: #999;
		font-family: monospace;
	}

	.stage-label {
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.2;
		margin-top: 0.25rem;
		max-width: 80px;
		word-wrap: break-word;
		hyphens: auto;
	}

	.stage-item.active .stage-label {
		color: #2e7d32;
		font-weight: 600;
	}

	.stage-item.inactive .stage-label {
		color: #d32f2f;
		font-weight: 600;
	}

	.stage-item.future .stage-label {
		color: #999;
	}

	/* Dark mode support */
	:global(.dark) .progress-bar {
		background-color: #444;
	}

	:global(.dark) .stage-item.future .stage-circle {
		background-color: #333;
		border-color: #555;
		color: #ccc;
	}

	:global(.dark) .stage-item.future .stage-label {
		color: #ccc;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.stage-label {
			font-size: 0.65rem;
			max-width: 60px;
		}

		.stage-circle {
			width: 28px;
			height: 28px;
		}
	}

	@media (max-width: 480px) {
		.progress-stages {
			flex-wrap: nowrap;
			overflow-x: auto;
		}

		.stage-item {
			flex: 0 0 auto;
			min-width: 60px;
			margin-bottom: 0;
		}

		.stage-label {
			font-size: 0.55rem;
			max-width: 55px;
			line-height: 1.1;
		}

		.stage-circle {
			width: 22px;
			height: 22px;
		}
	}
</style>
