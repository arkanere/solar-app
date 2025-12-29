<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
		title: string;
		description?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	let {
		title,
		description,
		class: className,
		children,
		...restProps
	}: EmptyStateProps = $props();
</script>

<div
	data-slot="empty-state"
	class={cn('text-center p-12 bg-card rounded-lg border border-border shadow-card', className)}
	{...restProps}
>
	<p class="text-foreground">{title}</p>
	{#if description}
		<p class="mt-2 text-sm text-foreground-muted">{description}</p>
	{/if}
	{#if children}
		<div class="mt-4">
			{@render children()}
		</div>
	{/if}
</div>
