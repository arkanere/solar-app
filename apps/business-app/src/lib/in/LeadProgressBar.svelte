<script>
	export let currentStage = 0;
	export let leadCategory = 3; // 2 = Non-Exclusive-Claimed, 3 = Exclusive
	export let isActive = true; // New prop to track if lead is active

	// Define stages for different lead categories
	const exclusiveStages = [
		'New Inquiry',
		'Contacted',
		'Proposal/Quotation Sent',
		'Won'
	];

	const nonExclusiveClaimedStages = [
		'Claimed',
		'Contacted',
		'Proposal/Quotation Sent',
		'Won'
	];

	// For display purposes, add "Qualified by Solar Vipani" before the actual stages for non-exclusive claimed leads
	const nonExclusiveClaimedDisplayStages = [
		'Qualified by Solar Vipani',
		'Claimed',
		'Contacted',
		'Proposal/Quotation Sent',
		'Won'
	];

	$: stages = leadCategory === 2 ? nonExclusiveClaimedDisplayStages : exclusiveStages;
	// For non-exclusive claimed leads, adjust progress calculation to account for the extra display stage
	$: progressPercentage = leadCategory === 2 
		? ((currentStage + 1) / (stages.length - 1)) * 100
		: (currentStage / (stages.length - 1)) * 100;
	$: progressColor = isActive ? 'active' : 'inactive';
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
		height: 4px;
		background-color: #e5e7eb;
		border-radius: 2px;
		margin-bottom: 1rem;
		position: relative;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.progress-fill.active {
		background: linear-gradient(90deg, #10b981 0%, #059669 100%);
		box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
	}

	.progress-fill.inactive {
		background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
		box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
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
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: 3px solid;
	}

	.stage-item.active .stage-circle {
		background-color: #10b981;
		border-color: #10b981;
		color: white;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
	}

	.stage-item.inactive .stage-circle {
		background-color: #ef4444;
		border-color: #ef4444;
		color: white;
		box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
	}

	.stage-item.future .stage-circle {
		background-color: #f9fafb;
		border-color: #d1d5db;
		color: #9ca3af;
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
		line-height: 1.3;
		margin-top: 0.375rem;
		max-width: 85px;
		word-wrap: break-word;
		hyphens: auto;
		color: #6b7280;
	}

	.stage-item.active .stage-label {
		color: #059669;
		font-weight: 600;
	}

	.stage-item.inactive .stage-label {
		color: #dc2626;
		font-weight: 600;
	}

	.stage-item.future .stage-label {
		color: #9ca3af;
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
			font-size: 0.688rem;
			max-width: 70px;
		}

		.stage-circle {
			width: 36px;
			height: 36px;
			font-size: 0.813rem;
		}
	}

	@media (max-width: 480px) {
		.progress-stages {
			flex-wrap: nowrap;
			overflow-x: auto;
		}

		.stage-item {
			flex: 0 0 auto;
			min-width: 70px;
			margin-bottom: 0;
		}

		.stage-label {
			font-size: 0.625rem;
			max-width: 65px;
			line-height: 1.2;
		}

		.stage-circle {
			width: 32px;
			height: 32px;
			font-size: 0.75rem;
		}
	}
</style>