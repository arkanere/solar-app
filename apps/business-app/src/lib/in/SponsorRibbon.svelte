<script lang="ts">
	const items = [
		'Reach 500+ solar EPC companies across India',
		'Advertise your solar panels, inverters & accessories',
		'Showcase your solar financing products to verified installers',
		'Promote your solar events & training programs',
		'Partner with India\'s growing EPC network'
	];

	const ticker = items.join('  \u00a0\u2022\u00a0  ');
</script>

<div class="ribbon">
	<span class="label">Sponsored</span>
	<div class="divider"></div>
	<div class="ticker-wrap">
		<div class="ticker">
			<span>{ticker}&nbsp;&nbsp;&nbsp;</span>
			<span aria-hidden="true">{ticker}&nbsp;&nbsp;&nbsp;</span>
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
		animation: scroll-left 40s linear infinite;
	}

	.ticker span {
		padding-left: 1rem;
	}

	@keyframes scroll-left {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}
</style>
