<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Trash2 } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	// The one trash-icon trigger used for every delete in the app. Grey at rest,
	// red on hover, so it stays quiet inside lists and tables.
	let {
		label,
		onclick,
		disabled = false,
		class: className = ''
	}: {
		label: string;
		onclick: () => void;
		disabled?: boolean;
		class?: string;
	} = $props();
</script>

<Button
	variant="ghost"
	size="icon-sm"
	class={cn('text-muted-foreground hover:bg-destructive/10 hover:text-destructive', className)}
	title={label}
	aria-label={label}
	{onclick}
	{disabled}
>
	<Trash2 size={16} />
</Button>
