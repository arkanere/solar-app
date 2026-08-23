<script lang="ts">
	import type { Snippet } from 'svelte';

	// The shared page shell. Used explicitly by each page rather than dropped into
	// a +layout.svelte, because /in/thank-you has no session to pass a user from.
	let {
		user = null,
		maxWidth = '5xl',
		children
	}: {
		user?: { name?: string | null; email?: string | null } | null;
		maxWidth?: '3xl' | '5xl';
		children: Snippet;
	} = $props();

	// Written out rather than interpolated so Tailwind's scanner sees the classes.
	const widths = { '3xl': 'max-w-3xl', '5xl': 'max-w-5xl' } as const;
</script>

<div class="min-h-screen bg-background">
	<header class="sticky top-0 border-b border-border bg-card"
		style="z-index: var(--z-sticky)">
		<div
			class="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6"
		>
			<a href="/in" class="flex shrink-0 items-center">
				<img
					src="https://solarvipani.com/logo.webp"
					alt="Solar Vipani"
					width="100"
					height="50"
					class="h-8 w-auto"
				/>
			</a>

			{#if user}
				<div class="flex items-center gap-3">
					<div class="hidden text-right sm:block">
						<p class="text-sm font-medium leading-tight text-foreground">{user.name || 'User'}</p>
						{#if user.email}
							<p class="text-xs leading-tight text-muted-foreground">{user.email}</p>
						{/if}
					</div>
					<!-- The logout action lives on the /in page, so this must be absolute:
					     a relative ?/logout would miss it from /in/feedback. -->
					<form method="POST" action="/in?/logout">
						<button
							type="submit"
							class="inline-flex h-8 items-center justify-center rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-background-tertiary"
						>
							Sign Out
						</button>
					</form>
				</div>
			{/if}
		</div>
	</header>

	<main>
		<div class="mx-auto w-full {widths[maxWidth]} px-4 py-6 md:px-6 md:py-8">
			{@render children()}
		</div>
	</main>
</div>
