<script lang="ts">
	import { cn } from "$lib/utils.js";

	interface Props {
		id?: string;
		min?: number[];
		max?: number[];
		step?: number[];
		value?: number | number[];
		class?: string;
		disabled?: boolean;
		onchange?: (value: number) => void;
	}

	let {
		id,
		min = [0],
		max = [100],
		step = [1],
		value = $bindable(50),
		class: className,
		disabled = false,
		onchange,
		...restProps
	}: Props = $props();

	const minValue = $derived(min[0] ?? 0);
	const maxValue = $derived(max[0] ?? 100);
	const stepValue = $derived(step[0] ?? 1);

	function handleChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const newValue = Number(input.value);
		value = newValue;
		onchange?.(newValue);
	}
</script>

<input
	type="range"
	{id}
	{disabled}
	min={minValue}
	max={maxValue}
	step={stepValue}
	value={Array.isArray(value) ? value[0] : value}
	onchange={handleChange}
	class={cn(
		"w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary",
		"hover:accent-primary/90",
		disabled && "opacity-50 cursor-not-allowed",
		className
	)}
	{...restProps}
/>

<style>
	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: hsl(var(--primary));
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	input[type="range"]::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: hsl(var(--primary));
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	input[type="range"]::-webkit-slider-runnable-track {
		background: hsl(var(--input));
		height: 8px;
		border-radius: 4px;
	}

	input[type="range"]::-moz-range-track {
		background: hsl(var(--input));
		height: 8px;
		border-radius: 4px;
		border: none;
	}
</style>
