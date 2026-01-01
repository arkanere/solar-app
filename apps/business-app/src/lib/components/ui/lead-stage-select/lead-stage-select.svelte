<script lang="ts">
	import { cn } from '$lib/utils';
	import {
		type LeadCategory,
		type LeadStage,
		getStagesMapForCategory
	} from '$lib/constants/lead';

	let {
		value = $bindable(0),
		category = 3,
		includeAll = false,
		disabled = false,
		onchange = () => {},
		id = '',
		class: className = ''
	}: {
		value?: LeadStage | 'all';
		category?: LeadCategory;
		includeAll?: boolean;
		disabled?: boolean;
		onchange?: (value: LeadStage | 'all') => void;
		id?: string;
		class?: string;
	} = $props();

	let stagesMap = $derived(getStagesMapForCategory(category));
	let options = $derived(
		Object.entries(stagesMap)
			.filter(([key]) => includeAll || key !== 'all')
			.map(([key, label]) => ({ value: key === 'all' ? 'all' : Number(key), label }))
	);

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newValue = target.value === 'all' ? 'all' : Number(target.value) as LeadStage;
		value = newValue;
		onchange(newValue);
	}
</script>

<select
	{id}
	value={value}
	{disabled}
	onchange={handleChange}
	class={cn(
		'w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs',
		'focus:outline-none focus:ring-2 focus:ring-ring',
		'disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	data-slot="lead-stage-select"
>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
