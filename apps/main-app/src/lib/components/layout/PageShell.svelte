<script lang="ts">
	import type { Snippet } from 'svelte';

	// The page container every content page should use.
	//
	// Neither route layout constrains width — both `(layout-1)/+layout.svelte` and
	// `[country=country]/(layout-1)/+layout.svelte` render a bare
	// `{@render children?.()}` — so each page invented its own `<main>`, width and
	// padding, and the tree drifted into five different container widths. This
	// owns all three, including the `<main>` landmark, which most pages were
	// missing entirely.
	//
	// Deliberately has no `dark:` classes. The tokens in app.css already flip
	// under `.dark`; a `dark:` override here would mean light and dark drift
	// apart again.

	let {
		width = 'page',
		class: className = '',
		children
	}: {
		/** page = 1140px (default), content = 896px (tools), doc = 768px (legal/forms) */
		width?: 'page' | 'content' | 'doc';
		class?: string;
		children: Snippet;
	} = $props();

	const widths = {
		page: 'max-w-[theme(--page-max-width)]',
		content: 'max-w-[theme(--page-max-width-content)]',
		doc: 'max-w-[theme(--page-max-width-doc)]'
	};
</script>

<main class="bg-background text-foreground">
	<div
		class="mx-auto w-full {widths[width]} px-[theme(--container-padding)] py-8 space-y-[theme(--section-gap)] {className}"
	>
		{@render children()}
	</div>
</main>
