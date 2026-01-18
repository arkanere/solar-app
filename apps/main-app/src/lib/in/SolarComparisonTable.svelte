<script>
	import { isDarkMode } from '$lib/themeStore.svelte';
	
	let darkMode = $derived($isDarkMode);
</script>

<section class="comparison-section" class:dark={darkMode}>
	<h2>Simplifying Solar For Everyone All over India</h2>
	<div class="comparison-table-container">
		<table class="comparison-table">
			<thead>
				<tr>
					<th>Aspect</th>
					<th>With <strong>Solar Vipani</strong></th>
					<th>Traditional Approach</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><strong>Finding Installers</strong></td>
					<td class="advantage">Verified local installers</td>
					<td class="disadvantage">Unverified, hard to find</td>
				</tr>
				<tr>
					<td><strong>Getting Quotes</strong></td>
					<td class="advantage">Quick multiple quotations</td>
					<td class="disadvantage">Slow, limited options</td>
				</tr>
				<tr>
					<td><strong>Information</strong></td>
					<td class="advantage">Credible & transparent</td>
					<td class="disadvantage">Scattered & unreliable</td>
				</tr>
				<tr>
					<td><strong>Multiple Brands</strong></td>
					<td class="advantage">Compare many brands in one place</td>
					<td class="disadvantage">Limited to installer's choice</td>
				</tr>
				<tr>
					<td><strong>Process</strong></td>
					<td class="advantage">Hassle-free & guided</td>
					<td class="disadvantage">Time-consuming & confusing</td>
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
		--success-color: #28a745;
		--success-light: #d4edda;
		--danger-color: #dc3545;
		--danger-light: #f8d7da;
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
		--section-padding: 3rem 2rem;
		--transition-medium: 0.3s ease;
	}

	.comparison-section {
		padding: var(--section-padding);
		font-family: var(--font-family);
		background-color: var(--light-card-bg);
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-medium);
		margin-bottom: 3rem;
	}

	.dark.comparison-section {
		background-color: var(--dark-card-bg);
		color: var(--text-light);
	}

	.comparison-section h2 {
		font-size: 2.2rem;
		font-weight: 600;
		margin-bottom: 2rem;
		text-align: center;
		color: var(--primary-color);
		line-height: 1.3;
	}

	.dark.comparison-section h2 {
		color: var(--primary-light);
	}

	.comparison-table-container {
		background-color: var(--light-card-bg);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		padding: 2rem;
		overflow-x: auto;
		transition: box-shadow var(--transition-medium);
		max-width: 1000px;
		margin: 0 auto;
	}

	.comparison-table-container:hover {
		box-shadow: var(--shadow-lg);
	}

	.dark .comparison-table-container {
		background-color: var(--dark-card-bg);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.comparison-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 1rem;
		line-height: 1.6;
	}

	.comparison-table th {
		background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
		color: white;
		padding: 1.2rem 1rem;
		text-align: left;
		font-weight: 600;
		font-size: 1.1rem;
		border-bottom: 3px solid var(--primary-color);
	}

	.comparison-table th:first-child {
		border-radius: var(--border-radius-md) 0 0 0;
		width: 25%;
	}

	.comparison-table th:nth-child(2) {
		width: 37.5%;
	}

	.comparison-table th:last-child {
		border-radius: 0 var(--border-radius-md) 0 0;
		width: 37.5%;
	}

	.comparison-table td {
		padding: 1.2rem 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		vertical-align: top;
	}

	.dark .comparison-table td {
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.comparison-table tbody tr:last-child td {
		border-bottom: none;
	}

	.comparison-table tbody tr:nth-child(even) {
		background-color: rgba(0, 0, 0, 0.02);
	}

	.dark .comparison-table tbody tr:nth-child(even) {
		background-color: rgba(255, 255, 255, 0.02);
	}

	.comparison-table tbody tr:hover {
		background-color: rgba(0, 86, 179, 0.05);
		transform: translateY(-1px);
		transition: all 0.2s ease;
	}

	.dark .comparison-table tbody tr:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	/* First column styling */
	.comparison-table td:first-child {
		font-weight: 600;
		color: var(--text-dark);
		background-color: rgba(0, 86, 179, 0.03);
	}

	.dark .comparison-table td:first-child {
		color: var(--text-light);
		background-color: rgba(255, 255, 255, 0.03);
	}

	/* Advantage column (Solar Vipani) */
	.advantage {
		color: var(--secondary-color);
		font-weight: 500;
		background-color: rgba(76, 175, 80, 0.1);
		position: relative;
	}

	.advantage::before {
		content: '✓';
		color: var(--secondary-color);
		font-weight: bold;
		margin-right: 0.5rem;
	}

	.dark .advantage {
		background-color: rgba(76, 175, 80, 0.15);
		color: var(--secondary-color);
	}

	/* Disadvantage column (Traditional) */
	.disadvantage {
		color: #dc3545;
		font-weight: 500;
		background-color: rgba(220, 53, 69, 0.1);
		position: relative;
	}

	.disadvantage::before {
		content: '✗';
		color: #dc3545;
		font-weight: bold;
		margin-right: 0.5rem;
	}

	.dark .disadvantage {
		background-color: rgba(220, 53, 69, 0.15);
		color: #f56565;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.comparison-section {
			padding: 2rem 1rem;
		}

		.comparison-section h2 {
			font-size: 1.8rem;
		}

		.comparison-table-container {
			padding: 1.5rem 0.5rem;
		}

		.comparison-table {
			font-size: 0.9rem;
		}

		.comparison-table th,
		.comparison-table td {
			padding: 1rem 0.5rem;
		}

		.comparison-table th {
			font-size: 1rem;
		}
	}

	@media (max-width: 576px) {
		.comparison-section {
			padding: 2rem 0.25rem;
		}

		.comparison-section h2 {
			font-size: 1.6rem;
			margin-bottom: 1.5rem;
		}

		.comparison-table-container {
			padding: 1rem 0.25rem;
		}

		.comparison-table {
			font-size: 0.85rem;
		}

		.comparison-table th,
		.comparison-table td {
			padding: 0.8rem 0.25rem;
		}

		.comparison-table th {
			font-size: 0.9rem;
		}

		/* Stack table on very small screens */
		.comparison-table th:first-child {
			width: 30%;
		}

		.comparison-table th:nth-child(2),
		.comparison-table th:last-child {
			width: 35%;
		}
	}
</style>