<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type StepperItemProps = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		step: number;
		title?: string;
		description?: string;
		icon?: Snippet;
		ref?: HTMLDivElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';
	import { Check } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		step,
		title,
		description,
		icon,
		children,
		...restProps
	}: StepperItemProps = $props();

	const context = getContext<{ currentStep: number; orientation: 'horizontal' | 'vertical' }>(
		'stepper'
	);

	const status = $derived(
		step < context.currentStep ? 'completed' : step === context.currentStep ? 'active' : 'upcoming'
	);

	const isHorizontal = $derived(context.orientation === 'horizontal');
</script>

<div
	bind:this={ref}
	data-slot="stepper-item"
	data-status={status}
	data-step={step}
	class={cn(
		'group flex gap-3',
		isHorizontal ? 'flex-1 items-center' : 'items-start',
		className
	)}
	role="listitem"
	aria-current={status === 'active' ? 'step' : undefined}
	{...restProps}
>
	<!-- Step indicator -->
	<div class="relative flex items-center gap-3">
		<div
			class={cn(
				'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
				status === 'completed' && 'border-primary bg-primary text-primary-foreground',
				status === 'active' && 'border-primary bg-background text-primary',
				status === 'upcoming' && 'border-muted bg-background text-muted-foreground'
			)}
		>
			{#if status === 'completed'}
				<Check class="size-4" />
			{:else if icon}
				{@render icon()}
			{:else}
				{step + 1}
			{/if}
		</div>

		<!-- Labels (vertical layout) -->
		{#if !isHorizontal && (title || description)}
			<div class="flex flex-col">
				{#if title}
					<span
						class={cn(
							'text-sm font-medium',
							status === 'active' && 'text-foreground',
							status === 'upcoming' && 'text-muted-foreground',
							status === 'completed' && 'text-foreground'
						)}
					>
						{title}
					</span>
				{/if}
				{#if description}
					<span class="text-xs text-muted-foreground">{description}</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Connector line (horizontal) -->
	{#if isHorizontal}
		<div
			class={cn(
				'h-0.5 flex-1 transition-colors',
				status === 'completed' ? 'bg-primary' : 'bg-muted'
			)}
		></div>
	{/if}

	<!-- Labels (horizontal layout - below) -->
	{#if isHorizontal && (title || description)}
		<div class="absolute -bottom-6 left-0 flex flex-col text-center">
			{#if title}
				<span
					class={cn(
						'text-xs font-medium',
						status === 'active' && 'text-foreground',
						status === 'upcoming' && 'text-muted-foreground',
						status === 'completed' && 'text-foreground'
					)}
				>
					{title}
				</span>
			{/if}
		</div>
	{/if}

	<!-- Custom content -->
	{#if children}
		{@render children()}
	{/if}
</div>
