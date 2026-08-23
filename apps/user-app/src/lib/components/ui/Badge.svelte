<script module lang="ts">
	// A *-muted background with the saturated colour as text — never a solid
	// saturated fill. See docs/business-app-design-conventions.md §1.
	// Note: this app's token is --primary-strong, not business-app's
	// --accent-strong, so `text-accent-strong` would render nothing here.
	export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'outline';

	const variants: Record<BadgeVariant, string> = {
		neutral: 'bg-muted text-muted-foreground',
		accent: 'bg-accent-muted text-primary-strong',
		success: 'bg-success-muted text-success',
		warning: 'bg-warning-muted text-warning',
		outline: 'border-border text-foreground-secondary'
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'neutral',
		class: className = '',
		children
	}: { variant?: BadgeVariant; class?: string; children: Snippet } = $props();
</script>

<span
	class="inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-transparent px-2 py-0.5 text-xs font-medium {variants[
		variant
	]} {className}"
>
	{@render children()}
</span>
