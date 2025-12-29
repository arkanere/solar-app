<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ErrorBoundaryProps = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		fallback?: Snippet<[{ error: Error; reset: () => void }]>;
		onError?: (error: Error) => void;
		ref?: HTMLDivElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { AlertTriangle, RefreshCw } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		fallback,
		onError,
		...restProps
	}: ErrorBoundaryProps = $props();

	let error = $state<Error | null>(null);
	let key = $state(0);

	function handleError(e: ErrorEvent) {
		error = e.error || new Error(e.message);
		onError?.(error);
		e.preventDefault();
	}

	function reset() {
		error = null;
		key++;
	}

	onMount(() => {
		// Listen for unhandled errors within this component tree
		const element = ref;
		if (!element) return;

		// Create a MutationObserver-based error boundary isn't directly possible,
		// but we can use the window error handler with filtering
		const originalOnError = window.onerror;

		window.onerror = (message, source, lineno, colno, errorObj) => {
			// Only catch errors, let other handlers process too
			if (errorObj) {
				error = errorObj;
				onError?.(errorObj);
				return true;
			}
			return originalOnError?.call(window, message, source, lineno, colno, errorObj) ?? false;
		};

		return () => {
			window.onerror = originalOnError;
		};
	});
</script>

<div
	bind:this={ref}
	data-slot="error-boundary"
	class={cn(className)}
	{...restProps}
>
	{#if error}
		{#if fallback}
			{@render fallback({ error, reset })}
		{:else}
			<div
				class="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center"
			>
				<AlertTriangle class="size-12 text-destructive" />
				<div>
					<h3 class="text-lg font-semibold text-foreground">Something went wrong</h3>
					<p class="mt-1 text-sm text-muted-foreground">
						{error.message || 'An unexpected error occurred'}
					</p>
				</div>
				<button
					type="button"
					class={cn(
						'inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
						'hover:bg-primary/90',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
					)}
					onclick={reset}
				>
					<RefreshCw class="size-4" />
					Try again
				</button>
			</div>
		{/if}
	{:else}
		{#key key}
			{@render children?.()}
		{/key}
	{/if}
</div>
