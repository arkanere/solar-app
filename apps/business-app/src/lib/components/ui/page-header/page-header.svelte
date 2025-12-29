<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type PageHeaderProps = HTMLAttributes<HTMLElement> & {
		title: string;
		description?: string;
		centered?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	let {
		title,
		description,
		centered = false,
		class: className,
		children,
		...restProps
	}: PageHeaderProps = $props();
</script>

<header
	data-slot="page-header"
	class={cn('mb-8', centered && 'text-center', className)}
	{...restProps}
>
	{#if centered}
		<h1 class="text-2xl md:text-3xl font-semibold mb-2 text-accent">{title}</h1>
		{#if description}
			<p class="text-foreground-secondary">{description}</p>
		{/if}
		{#if children}
			<div class="mt-4">
				{@render children()}
			</div>
		{/if}
	{:else}
		<div class="flex justify-between items-center gap-8 flex-wrap md:flex-col md:items-stretch">
			<div class="flex-1">
				<h1 class="text-2xl md:text-3xl font-semibold mb-2 text-accent">{title}</h1>
				{#if description}
					<p class="text-foreground-secondary">{description}</p>
				{/if}
			</div>
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</header>
