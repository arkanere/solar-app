<script lang="ts">
	import type { Snippet } from 'svelte';

	// The app-wide banner idiom: a *-muted background with a 4px left rule in the
	// saturated colour.
	export type AlertVariant = 'success' | 'destructive' | 'warning' | 'accent';

	let {
		variant = 'accent',
		class: className = '',
		children
	}: { variant?: AlertVariant; class?: string; children: Snippet } = $props();

	const variants: Record<AlertVariant, string> = {
		success: 'bg-success-muted border-success',
		destructive: 'bg-destructive-muted border-destructive',
		warning: 'bg-warning-muted border-warning',
		accent: 'bg-accent-muted border-accent'
	};
</script>

<div
	class="rounded-md border-l-4 px-4 py-3 text-sm text-foreground {variants[variant]} {className}"
	role="status"
>
	{@render children()}
</div>
