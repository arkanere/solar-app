<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	let { class: className, children, ...restProps }: AlertDescriptionProps = $props();
</script>

<p data-slot="alert-description" class={cn('text-sm opacity-90', className)} {...restProps}>
	{@render children()}
</p>
