<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		isActive = true,
		progress = 0,
		class: className = ''
	}: {
		isActive?: boolean;
		progress: number;
		class?: string;
	} = $props();

	// Clamp progress between 0 and 100
	let clampedProgress = $derived(Math.min(100, Math.max(0, progress)));
</script>

<div class={cn('w-full', className)} data-slot="lead-progress-indicator">
	<!-- Progress bar container -->
	<div class="h-1 rounded bg-border overflow-hidden relative">
		<!-- Animated progress fill -->
		<div
			class={cn(
				'h-full rounded transition-[width] duration-400 ease-out',
				isActive
					? 'bg-gradient-to-r from-success to-success/80 shadow-success-glow'
					: 'bg-gradient-to-r from-destructive to-destructive/80 shadow-destructive-glow'
			)}
			style="width: {clampedProgress}%"
		></div>
	</div>
</div>
