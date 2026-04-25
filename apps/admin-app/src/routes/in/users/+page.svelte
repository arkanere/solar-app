<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	let users = $page.data.users || [];
	let errorMessage = $page.data.errorMessage;

	$: darkMode = $isDarkMode;
	$: users = $page.data.users || [];

	const BASE_URL = 'https://user.solarvipani.com';

	function magicLink(token) {
		return token ? `${BASE_URL}/signin-link/${token}` : null;
	}

	function formatDate(d) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Users ({users.length})</h1>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if users.length > 0}
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Joined</th>
						<th>Magic Link</th>
					</tr>
				</thead>
				<tbody>
					{#each users as user}
						<tr>
							<td>{user.id}</td>
							<td>{user.name || '—'}</td>
							<td>{user.email}</td>
							<td>{formatDate(user.created_at)}</td>
							<td>
								{#if user.magic_link_token}
									<a href={magicLink(user.magic_link_token)} target="_blank" rel="noopener noreferrer">
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
		<p>No users found.</p>
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
