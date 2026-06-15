<svelte:head>
	<title>Business Onboarding - Solar Vipani Admin</title>
</svelte:head>

<div class="page">
	<header>
		<h1>Business Onboarding</h1>
		<a href="/" class="back-link">Back to Dashboard</a>
	</header>

	<div class="cards">
		<a href="/in/business-onboarding/find-businesses" class="card">
			<div class="card-icon">FB</div>
			<h3>Find Businesses</h3>
			<p>Search and discover new businesses to onboard</p>
		</a>

		<a href="/in/business-onboarding/invitation-email-campaign" class="card">
			<div class="card-icon">EM</div>
			<h3>Invitation Email Campaign</h3>
			<p>Monitor outbound email campaigns to businesses</p>
		</a>
	</div>
</div>

<style>
	.page {
		padding: 30px;
		max-width: 1200px;
		margin: 0 auto;
		font-family: 'Georgia', serif;
		color: #333;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	h1 {
		font-size: 28px;
		margin: 0;
	}

	.back-link {
		color: #0077cc;
		text-decoration: none;
		font-size: 14px;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.card {
		background: white;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.card-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.card h3 {
		font-size: 1.4rem;
		margin-bottom: 0.5rem;
	}

	.card p {
		color: #666;
		font-size: 1rem;
	}
</style>
