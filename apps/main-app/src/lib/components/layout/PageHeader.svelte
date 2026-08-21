<script lang="ts">
	// The "heading + orange divider" unit, which was duplicated 20+ times across
	// the app in two competing spellings: the tokenised one kept here, and a
	// hardcoded `h-1 w-20` variant in partners/ and business-listing/.
	//
	// `as` exists because this renders section headings as well as page titles —
	// AboutSolarVipani used shadcn's CardTitle, which emits a <div>, so that
	// heading was not a heading at all to a screen reader.
	//
	// Orange headings are correct on main-app: it is a public marketing site and
	// the brand colour is deliberate here. That is the opposite of the rule in
	// docs/business-app-design-conventions.md, which governs the dashboard.

	let {
		title,
		lede,
		as = 'h1',
		align = 'center',
		divider = true
	}: {
		title: string;
		lede?: string;
		as?: 'h1' | 'h2';
		align?: 'center' | 'left';
		divider?: boolean;
	} = $props();

	const centered = $derived(align === 'center');
</script>

<div class={centered ? 'text-center' : ''}>
	<svelte:element
		this={as}
		class="{as === 'h1'
			? 'text-4xl md:text-5xl'
			: 'text-3xl md:text-4xl'} font-semibold mb-4 text-primary"
	>
		{title}
	</svelte:element>

	{#if divider}
		<div class="flex items-center my-4 {centered ? 'justify-center' : ''}">
			<span
				class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"
			></span>
		</div>
	{/if}

	{#if lede}
		<p class="text-foreground text-lg leading-relaxed max-w-2xl {centered ? 'mx-auto' : ''}">
			{lede}
		</p>
	{/if}
</div>
