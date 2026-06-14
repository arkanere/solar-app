<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	let feedback = $page.data.feedback || [];
	let errorMessage = $page.data.errorMessage;

	$: darkMode = $isDarkMode;
	$: feedback = $page.data.feedback || [];

	const BASE_URL = 'https://user.solarvipani.com';

	function magicLink(token) {
		return token ? `${BASE_URL}/signin-link/${token}` : null;
	}

	function formatDate(d) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
	}

	function stars(rating) {
		const r = Number(rating) || 0;
		return '★★★★★☆☆☆☆☆'.slice(5 - r, 10 - r);
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>User Feedback ({feedback.length})</h1>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if feedback.length > 0}
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th>User</th>
						<th>Email</th>
						<th>Callback</th>
						<th>Quotation</th>
						<th>Rating</th>
						<th class="suggestions-col">Suggestions</th>
						<th>Submitted</th>
						<th>Magic Link</th>
					</tr>
				</thead>
				<tbody>
					{#each feedback as f}
						<tr>
							<td>{f.name || '—'}</td>
							<td>{f.email}</td>
							<td class="center">
								{#if f.got_callback}
									<span class="yes">✅</span>
								{:else}
									<span class="no">❌</span>
								{/if}
							</td>
							<td class="center">
								{#if f.got_quotation}
									<span class="yes">✅</span>
								{:else}
									<span class="no">❌</span>
								{/if}
							</td>
							<td class="rating" title="{f.recommendation_rating} / 5">{stars(f.recommendation_rating)}</td>
							<td class="suggestions-col">{f.suggestions || '—'}</td>
							<td>{formatDate(f.updated_at)}</td>
							<td>
								{#if f.magic_link_token}
									<a href={magicLink(f.magic_link_token)} target="_blank" rel="noopener noreferrer">
										Login as user
									</a>
								{:else}
									<span class="no-token">No token</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p>No feedback found.</p>
	{/if}
</main>

<style>
	main {
		padding: 1.5rem;
	}

	h1 {
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.table-container {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th, td {
		padding: 0.6rem 0.9rem;
		text-align: left;
		border-bottom: 1px solid;
		white-space: nowrap;
		vertical-align: top;
	}

	.center {
		text-align: center;
	}

	.rating {
		color: #f5a623;
		letter-spacing: 1px;
		white-space: nowrap;
	}

	.suggestions-col {
		white-space: normal;
		min-width: 240px;
		max-width: 360px;
	}

	a {
		font-size: 0.85rem;
	}

	.no-token {
		color: #999;
		font-size: 0.85rem;
	}

	.error-message {
		color: #dc3545;
	}

	/* Light mode */
	.light {
		background-color: #fafafa;
		color: #333;
	}

	.light th, .light td {
		border-color: #e0e0e0;
	}

	.light th {
		background-color: #f0f0f0;
	}

	.light a {
		color: #0077cc;
	}

	/* Dark mode */
	.dark {
		background-color: #1a1a1a;
		color: #fff;
	}

	.dark th, .dark td {
		border-color: #444;
	}

	.dark th {
		background-color: #2a2a2a;
	}

	.dark a {
		color: #66b2ff;
	}
</style>
