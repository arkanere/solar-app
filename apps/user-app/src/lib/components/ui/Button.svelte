<script lang="ts">
	import type { Snippet } from 'svelte';

	// Renders an <a> when `href` is set, a <button> otherwise.
	// Text on the orange `default` variant is --primary-foreground (a warm
	// near-black), never white: white on #FF6600 is 2.94:1 and fails AA.
	export type ButtonVariant = 'default' | 'outline' | 'ghost';
	export type ButtonSize = 'default' | 'sm';

	let {
		variant = 'default',
		size = 'default',
		href = undefined,
		type = 'button',
		disabled = false,
		class: className = '',
		children,
		...rest
	}: {
		variant?: ButtonVariant;
		size?: ButtonSize;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	const variants: Record<ButtonVariant, string> = {
		default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
		outline: 'border border-border bg-card text-foreground hover:bg-background-tertiary',
		ghost: 'text-foreground-secondary hover:bg-muted hover:text-foreground'
	};

	const sizes: Record<ButtonSize, string> = {
		default: 'h-9 px-4 text-sm',
		sm: 'h-8 px-3 text-xs'
	};

	const base =
		'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50';
</script>

{#if href}
	<a {href} class="{base} {variants[variant]} {sizes[size]} {className}" {...rest}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class="{base} {variants[variant]} {sizes[size]} {className}" {...rest}>
		{@render children()}
	</button>
{/if}
