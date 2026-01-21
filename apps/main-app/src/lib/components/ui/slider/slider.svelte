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
		"w-full appearance-none cursor-pointer",
		disabled && "cursor-not-allowed",
		className
	)}
	style={`
		height: var(--slider-track-height);
		border-radius: var(--slider-track-radius);
		background: var(--slider-track-bg);
		${disabled ? `opacity: var(--slider-disabled-opacity)` : ''}
	`}
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
		width: var(--slider-thumb-size);
		height: var(--slider-thumb-size);
		border-radius: var(--slider-thumb-radius);
		background: var(--slider-thumb-bg);
		cursor: pointer;
		border: var(--slider-thumb-border);
		box-shadow: var(--slider-thumb-shadow);
	}

	input[type="range"]::-moz-range-thumb {
		width: var(--slider-thumb-size);
		height: var(--slider-thumb-size);
		border-radius: var(--slider-thumb-radius);
		background: var(--slider-thumb-bg);
		cursor: pointer;
		border: var(--slider-thumb-border);
		box-shadow: var(--slider-thumb-shadow);
	}

	input[type="range"]::-webkit-slider-runnable-track {
		background: var(--slider-track-bg);
		height: var(--slider-track-height);
		border-radius: var(--slider-track-radius);
	}

	input[type="range"]::-moz-range-track {
		background: var(--slider-track-bg);
		height: var(--slider-track-height);
		border-radius: var(--slider-track-radius);
		border: none;
	}
</style>
