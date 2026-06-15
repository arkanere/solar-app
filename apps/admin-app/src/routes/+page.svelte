<script>
	// SvelteKit automatically provides these props to pages
	export const data = undefined;
	export const params = {};

	import { goto } from '$app/navigation';

	async function handleLogout() {
		try {
			const response = await fetch('/logout', {
				method: 'POST'
			});

			if (response.ok || response.redirected) {
				window.location.href = '/login';
			}
		} catch (error) {
			console.error('Logout failed:', error);
			// Fallback to direct navigation
			window.location.href = '/login';
		}
	}
</script>

<div class="admin-container">
	<!-- Navigation Bar -->
	<nav class="navbar">
		<div class="nav-content">
			<div class="nav-brand">
				<h1>Admin Dashboard</h1>
			</div>

			<div class="nav-links">
				<a href="/in" class="nav-link">India Portal</a>
				<a href="/us" class="nav-link">US Portal</a>
				<button on:click={handleLogout} class="logout-btn">Logout</button>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="main-content">
		<div class="welcome-section">
			<h2>Welcome to Admin Dashboard</h2>
			<p>Select a portal to manage:</p>
		</div>

		<div class="portal-cards">
			<a href="/in" class="portal-card">
				<div class="card-icon">IN</div>
				<h3>India Portal</h3>
				<p>Manage Indian operations and businesses</p>
			</a>

			<a href="/us" class="portal-card">
				<div class="card-icon">US</div>
				<h3>US Portal</h3>
				<p>Manage US operations and businesses</p>
			</a>

<a href="/callsafe/business-onboarding/invitation-email-campaign" class="portal-card">
				<div class="card-icon">CS</div>
				<h3>CallSafe Campaign</h3>
				<p>Monitor CallSafe invitation email campaigns</p>
			</a>
		</div>
	</main>
</div>

<style>
	.admin-container {
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	.navbar {
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 1rem 2rem;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-brand h1 {
		font-size: 1.5rem;
		color: #333;
		margin: 0;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.nav-link {
		text-decoration: none;
		color: #555;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.nav-link:hover {
		background-color: #f0f0f0;
		color: #000;
	}

	.logout-btn {
		background-color: #dc3545;
		color: white;
		border: none;
		padding: 0.5rem 1.25rem;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.logout-btn:hover {
		background-color: #c82333;
	}

	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 2rem;
	}

	.welcome-section {
		text-align: center;
		margin-bottom: 3rem;
	}

	.welcome-section h2 {
		font-size: 2rem;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.welcome-section p {
		font-size: 1.1rem;
		color: #666;
	}

	.portal-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.portal-card {
		background: white;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s;
	}

	.portal-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.card-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.portal-card h3 {
		font-size: 1.5rem;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.portal-card p {
		color: #666;
		font-size: 1rem;
	}

	@media (max-width: 768px) {
		.nav-content {
			flex-direction: column;
			gap: 1rem;
		}

		.nav-links {
			flex-wrap: wrap;
			justify-content: center;
		}

		.portal-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
