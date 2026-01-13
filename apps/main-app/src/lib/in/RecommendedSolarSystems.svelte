<script>
	import { isDarkMode } from '$lib/themeStore';
	
	let darkMode = $derived($isDarkMode);
</script>

<section id="recommended-solar-systems" class={darkMode ? 'dark' : 'light'}>
	<h2>Recommended Solar Systems for Homes</h2>
	<div class="recommendation-table-container">
		<table class="recommendation-table">
			<thead>
				<tr>
					<th>Monthly Consumption / Bill</th>
					<th>Power Outage</th>
					<th>Recommended Solar System</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>100 – 200 units / ₹500 – ₹1,500</td>
					<td>No outage</td>
					<td><strong>1 – 2 kW — On-grid</strong><br><small>(no battery required; net metering)</small></td>
				</tr>
				<tr>
					<td>100 – 200 units / ₹500 – ₹1,500</td>
					<td>> 1 hour</td>
					<td><strong>1.5 – 2.5 kW — Hybrid</strong><br><small>(battery 1–3 kWh for critical loads)</small></td>
				</tr>
				<tr>
					<td>200 – 400 units / ₹1,500 – ₹3,000</td>
					<td>No outage</td>
					<td><strong>2 – 3 kW — On-grid</strong></td>
				</tr>
				<tr>
					<td>200 – 400 units / ₹1,500 – ₹3,000</td>
					<td>> 1 hour</td>
					<td><strong>3 – 4 kW — Hybrid</strong><br><small>(battery 3–6 kWh)</small></td>
				</tr>
				<tr>
					<td>400 – 600 units / ₹3,000 – ₹5,000</td>
					<td>No outage</td>
					<td><strong>3 – 5 kW — On-grid</strong></td>
				</tr>
				<tr>
					<td>400 – 600 units / ₹3,000 – ₹5,000</td>
					<td>> 1 hour</td>
					<td><strong>4 – 6 kW — Hybrid</strong><br><small>(battery 6–10 kWh)</small></td>
				</tr>
			</tbody>
		</table>
	</div>
</section>

<style>
	/* Root variables using custom properties */
	:root {
		/* Colors */
		--primary-color: #0056b3;
		--primary-light: #e6f0ff;
		--text-dark: #2c3e50;
		--text-medium: #546e7a;
		--text-light: #ecf0f1;
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a202c;
		--light-card-bg: #ffffff;
		--dark-card-bg: #2d3748;
		--border-radius-md: 8px;
		--border-radius-lg: 16px;
		--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
		--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
		--section-padding: 2rem 1.5rem;
		--transition-medium: 0.3s ease;
	}

	#recommended-solar-systems {
		padding: var(--section-padding);
		font-family: var(--font-family);
		transition: background-color var(--transition-medium);
	}

	#recommended-solar-systems h2 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		text-align: center;
		color: var(--primary-color);
	}

	#recommended-solar-systems.dark h2 {
		color: var(--primary-light);
	}

	.recommendation-table-container {
		background-color: var(--light-card-bg);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		padding: 1.5rem;
		overflow-x: auto;
		transition: box-shadow var(--transition-medium);
	}

	.recommendation-table-container:hover {
		box-shadow: var(--shadow-lg);
	}

	.dark .recommendation-table-container {
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.recommendation-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.recommendation-table th {
		background-color: var(--primary-color);
		color: white;
		padding: 1rem 0.75rem;
		text-align: left;
		font-weight: 600;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.recommendation-table th:first-child {
		border-radius: var(--border-radius-md) 0 0 0;
	}

	.recommendation-table th:last-child {
		border-radius: 0 var(--border-radius-md) 0 0;
	}

	.recommendation-table td {
		padding: 1rem 0.75rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		color: var(--text-dark);
		vertical-align: top;
	}

	.dark .recommendation-table td {
		border-bottom-color: rgba(255, 255, 255, 0.1);
		color: var(--text-light);
	}

	.recommendation-table tbody tr:last-child td {
		border-bottom: none;
	}

	.recommendation-table tbody tr:nth-child(even) {
		background-color: rgba(0, 0, 0, 0.02);
	}

	.dark .recommendation-table tbody tr:nth-child(even) {
		background-color: rgba(255, 255, 255, 0.02);
	}

	.recommendation-table tbody tr:hover {
		background-color: rgba(0, 86, 179, 0.05);
	}

	.dark .recommendation-table tbody tr:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.recommendation-table td strong {
		color: var(--primary-color);
		font-weight: 600;
	}

	.dark .recommendation-table td strong {
		color: #90caf9;
	}

	.recommendation-table td small {
		color: var(--text-medium);
		font-size: 0.85rem;
		display: block;
		margin-top: 0.25rem;
	}

	.dark .recommendation-table td small {
		color: #a0aec0;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		#recommended-solar-systems {
			padding: 1.5rem 0.25rem;
		}

		.recommendation-table-container {
			padding: 1rem 0.5rem;
		}

		.recommendation-table {
			font-size: 0.85rem;
		}

		.recommendation-table th,
		.recommendation-table td {
			padding: 0.75rem 0.5rem;
		}

		.recommendation-table th {
			font-size: 0.8rem;
		}

		#recommended-solar-systems h2 {
			font-size: 1.6rem;
		}
	}

	@media (max-width: 576px) {
		#recommended-solar-systems {
			padding: 1.5rem 0.25rem;
		}

		.recommendation-table-container {
			padding: 1rem 0.25rem;
		}

		.recommendation-table {
			font-size: 0.8rem;
		}

		.recommendation-table th,
		.recommendation-table td {
			padding: 0.6rem 0.4rem;
		}

		#recommended-solar-systems h2 {
			font-size: 1.4rem;
		}
	}
</style>