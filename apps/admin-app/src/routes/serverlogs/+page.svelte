<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore'; // Import dark mode state

	// Access data from the load function
	export let data;
	let logs = data.logs || [];
	let errorMessage = data.errorMessage;

	$: darkMode = $isDarkMode; // Watch for changes in dark mode state
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Server Logs</h1>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if logs.length > 0}
		<table>
			<thead>
				<tr>
					<th>Timestamp</th>
					<th>Method</th>
					<th>URL</th>
					<th>Status Code</th>
					<th>Response Time (ms)</th>
					<th>User Agent</th>
					<th>Referrer</th>
					<th>Error Message</th>
				</tr>
			</thead>
			<tbody>
				{#each logs as log}
					<tr>
						<td>{new Date(log.timestamp).toLocaleString()}</td>
						<td>{log.method}</td>
						<td>{log.url}</td>
						<td>{log.status_code}</td>
						<td>{log.response_time}</td>
						<td>{log.user_agent}</td>
						<td>{log.referrer}</td>
						<td>{log.error_message}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p>No server logs found.</p>
	{/if}
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--light-secondary-text-color: #666;
		--dark-secondary-text-color: #ccc;
		--accent-color: #0056b3;
		--light-border-color: #ddd;
		--dark-border-color: #444;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout */
	main {
		padding: 2rem;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
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

	/* Page title styling */
	h1 {
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
	}

	/* Error message styling */
	.error-message {
		color: red;
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
	}

	/* Table styling */
	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
	}

	th,
	td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--light-border-color);
		word-wrap: break-word;
		word-break: break-word;
	}

	/* Fix column widths */
	th:nth-child(1),
	td:nth-child(1) {
		width: 150px;
	}

	th:nth-child(2),
	td:nth-child(2) {
		width: 100px;
	}

	th:nth-child(3),
	td:nth-child(3) {
		width: 250px;
	}

	th:nth-child(4),
	td:nth-child(4) {
		width: 120px;
	}

	th:nth-child(5),
	td:nth-child(5) {
		width: 150px;
	}

	th:nth-child(6),
	td:nth-child(6) {
		width: 200px;
	}

	th:nth-child(7),
	td:nth-child(7) {
		width: 200px;
	}

	th:nth-child(8),
	td:nth-child(8) {
		width: 200px;
	}

	/* Alternate row colors */
	tbody tr:nth-child(odd) {
		background-color: var(--light-bg-color);
	}

	/* Dark mode adjustments */
	.dark th,
	.dark td {
		border-bottom: 1px solid var(--dark-border-color);
	}

	.dark tbody tr:nth-child(odd) {
		background-color: #2a2a2a;
	}
</style>
