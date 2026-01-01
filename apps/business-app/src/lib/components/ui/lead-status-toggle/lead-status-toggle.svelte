<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		value = $bindable(true),
		disabled = false,
		onchange = () => {},
		id = '',
		class: className = ''
	}: {
		value?: boolean;
		disabled?: boolean;
		onchange?: (value: boolean) => void;
		id?: string;
		class?: string;
	} = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newValue = target.value === 'true';
		value = newValue;
		onchange(newValue);
	}
</script>

<select
	{id}
	value={value.toString()}
	{disabled}
	onchange={handleChange}
	class={cn(
		'w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs',
		'focus:outline-none focus:ring-2 focus:ring-ring',
		'disabled:cursor-not-allowed disabled:opacity-50',
		value ? 'text-success' : 'text-destructive',
		className
	)}
	data-slot="lead-status-toggle"
>
	<option value="true">Active</option>
	<option value="false">Inactive</option>
</select>
