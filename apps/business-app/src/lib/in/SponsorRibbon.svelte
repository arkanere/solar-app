<script lang="ts">
	const items: { text: string; url?: string }[] = [
		{ text: 'Quality Clickss: Grow your business with Paid Ads on Google, Facebook, Instagram', url: 'https://qualityclickss.com/?ref=solarvipani' },
		{ text: 'Reach 500+ solar EPC companies across India' },
		{ text: 'Advertise your solar panels, inverters & accessories' },
		{ text: 'Showcase your solar financing products to verified installers' },
		{ text: 'Promote your solar events & training programs' },
		{ text: 'Partner with India\'s growing EPC network' }
	];

	// Shuffle on each page load so all items get equal exposure over time
	const shuffled = [...items].sort(() => Math.random() - 0.5);

	const sep = '\u00a0\u00a0\u2022\u00a0\u00a0';
</script>

<div class="ribbon">
	<span class="label">Sponsored</span>
	<div class="divider"></div>
	<div class="ticker-wrap">
		{#snippet tickerContent()}
			{#each shuffled as item, i}
				{#if item.url}
					<a href={item.url} target="_blank" rel="noopener noreferrer" class="ticker-link">{item.text}</a>
				{:else}
					<span>{item.text}</span>
				{/if}
				{#if i < shuffled.length - 1}<span class="sep">{sep}</span>{/if}
			{/each}
			<span class="sep">{sep}</span>
		{/snippet}

		<div class="ticker">
			<span class="ticker-inner">{@render tickerContent()}</span>
			<span class="ticker-inner" aria-hidden="true">{@render tickerContent()}</span>
		</div>
	</div>
</div>

<style>
	.ribbon {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--ribbon-height);
		z-index: 1050;
		display: flex;
		align-items: center;
		background: hsl(var(--background));
		color: hsl(var(--foreground));
		border-bottom: 1px solid hsl(var(--border));
		font-size: 1.05rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		overflow: hidden;
	}

	.label {
		padding: 0 0.75rem;
		font-size: 0.975rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		white-space: nowrap;
		opacity: 0.85;
		flex-shrink: 0;
	}

	.divider {
		width: 1px;
		height: 60%;
		background: currentColor;
		opacity: 0.3;
		flex-shrink: 0;
	}

	.ticker-wrap {
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.ticker {
		display: flex;
		white-space: nowrap;
		animation: scroll-left 50s linear infinite;
	}

	.ticker-inner {
		padding-left: 1rem;
		display: inline-flex;
		align-items: center;
	}

	.sep {
		opacity: 0.5;
	}

	.ticker-link {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: currentColor;
		opacity: 0.9;
	}

	.ticker-link:hover {
		opacity: 1;
	}

	@keyframes scroll-left {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}
</style>
