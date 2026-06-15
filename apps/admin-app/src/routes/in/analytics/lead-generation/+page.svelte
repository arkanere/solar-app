<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';
	import { onMount, afterUpdate } from 'svelte';
	import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';

	Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

	$: darkMode = $isDarkMode;
	$: analytics = $page.data.analytics || {};
	$: error = $page.data.error;

	let canvas;
	let chart;

	function buildChart() {
		if (!canvas || !analytics.trendData?.length) return;

		const textColor = darkMode ? '#f0f0f0' : '#333';
		const gridColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

		const labels = analytics.trendData.map(d => {
			const date = new Date(d.date + 'T00:00:00');
			return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		});

		const data = {
			labels,
			datasets: [
				{
					label: 'Avg Daily (90 days)',
					data: analytics.trendData.map(d => d.avg90),
					borderColor: '#0056b3',
					backgroundColor: 'rgba(0, 86, 179, 0.1)',
					fill: true,
					tension: 0.3,
					pointRadius: 4
				},
				{
					label: 'Avg Daily (30 days)',
					data: analytics.trendData.map(d => d.avg30),
					borderColor: '#28a745',
					backgroundColor: 'rgba(40, 167, 69, 0.1)',
					fill: true,
					tension: 0.3,
					pointRadius: 4
				},
				{
					label: 'Avg Daily (15 days)',
					data: analytics.trendData.map(d => d.avg15),
					borderColor: '#fd7e14',
					backgroundColor: 'rgba(253, 126, 20, 0.1)',
					fill: true,
					tension: 0.3,
					pointRadius: 4
				}
			]
		};

		if (chart) chart.destroy();

		chart = new Chart(canvas, {
			type: 'line',
			data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: { mode: 'index', intersect: false },
				plugins: {
					legend: {
						labels: { color: textColor, usePointStyle: true, padding: 20 }
					},
					tooltip: {
						callbacks: {
							label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} leads/day`
						}
					}
				},
				scales: {
					x: {
						ticks: { color: textColor },
						grid: { color: gridColor }
					},
					y: {
						beginAtZero: true,
						ticks: { color: textColor },
						grid: { color: gridColor },
						title: {
							display: true,
							text: 'Avg Leads / Day',
							color: textColor
						}
					}
				}
			}
		});
	}

	onMount(() => buildChart());
	afterUpdate(() => buildChart());
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<a href="/admin/analytics" class="back-link">← Back to Analytics</a>
		<h1>Lead Generation Analytics</h1>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{:else}
		<div class="stats-grid">
			<div class="stat-card">
				<h2>Last 3 Months</h2>
				<div class="stat-number">{analytics.avgDaily90}</div>
				<div class="stat-label">avg leads / day</div>
			</div>

			<div class="stat-card">
				<h2>Last Month</h2>
				<div class="stat-number">{analytics.avgDaily30}</div>
				<div class="stat-label">avg leads / day</div>
			</div>

			<div class="stat-card">
				<h2>Last 15 Days</h2>
				<div class="stat-number">{analytics.avgDaily15}</div>
				<div class="stat-label">avg leads / day</div>
			</div>
		</div>

		<div class="chart-section">
			<h3>Average Daily Leads - Trend (Last 3 Months)</h3>
			<div class="chart-container">
				<canvas bind:this={canvas}></canvas>
			</div>
		</div>
	{/if}
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--card-light-bg: #fff;
		--card-dark-bg: #333;
		--border-light: #ddd;
		--border-dark: #555;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout styling */
	main {
		padding: 2rem 1rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Light mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Header section */
	.header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-block;
		color: var(--accent-color);
		text-decoration: none;
		margin-bottom: 1rem;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.back-link:hover {
		color: var(--hover-color);
	}

	h1 {
		font-size: 2.2rem;
		margin: 0;
		font-weight: 600;
	}

	/* Error state */
	.error {
		text-align: center;
		padding: 2rem;
		font-size: 1.1rem;
		color: #dc3545;
	}

	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	/* Stat card styling */
	.stat-card {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
		transition: transform 0.2s ease;
	}

	.light .stat-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
	}

	.dark .stat-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
	}

	.stat-card:hover {
		transform: translateY(-2px);
	}

	.stat-card h2 {
		font-size: 1rem;
		margin-bottom: 1rem;
		opacity: 0.8;
		font-weight: 500;
	}

	.stat-number {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--accent-color);
	}

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.chart-section {
		margin-bottom: 3rem;
	}

	.chart-section h3 {
		font-size: 1.3rem;
		margin-bottom: 1rem;
		color: var(--accent-color);
	}

	.chart-container {
		position: relative;
		height: 400px;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.light .chart-container {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
	}

	.dark .chart-container {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.stat-number {
			font-size: 2rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		.chart-container {
			height: 300px;
		}
	}
</style>