<script lang="ts">
	import BillUpload from '$lib/components/BillUpload.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type ClaimedBusiness = PageData['claimedBusinesses'][number];

	function formatDate(dateString: Date | string | null) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleString('en-IN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStageLabel(stage: number | null) {
		const stages: Record<number, string> = {
			0: 'New Inquiry',
			1: 'Qualified',
			2: 'Proposal Sent',
			3: 'Won'
		};
		return (stage != null && stages[stage]) || 'Under Review';
	}

	function groupClaimsByLead(claimedBusinesses: ClaimedBusiness[]) {
		const grouped = new Map<number, ClaimedBusiness[]>();
		claimedBusinesses.forEach((claim) => {
			const key = claim.originalLeadId;
			if (!grouped.has(key)) grouped.set(key, []);
			grouped.get(key)!.push(claim);
		});
		return grouped;
	}

	const claimsGroupedByLead = $derived(groupClaimsByLead(data.claimedBusinesses || []));
</script>

<svelte:head>
	<title>Dashboard - User App</title>
	<meta name="description" content="User Dashboard" />
</svelte:head>

<main>
	{#if !data.user}
		<section class="login-section">
			<div class="login-card">
				<h1>Track Your Solar Inquiry</h1>
				<p class="login-subtitle">
					To view your inquiry status and installer interest, please use the sign-in link sent to
					you by email from Solar Vipani.
				</p>
				<p class="login-hint">
					The link is sent automatically when an installer expresses interest in your inquiry.
					Check your inbox for an email from <strong>Solar Vipani</strong>.
				</p>
			</div>
		</section>
	{:else}
		<section class="welcome-section">
			<h1>Welcome, {data.user.name || 'User'}!</h1>
			<p class="email">{data.user.email}</p>
			<form method="POST" action="?/logout" class="logout-form">
				<button type="submit" class="logout-btn">Sign Out</button>
			</form>
		</section>

	<section class="dashboard-content">
		<h2>Your Solar Inquiry</h2>

		{#if data.leads && data.leads.length > 0}
			{#if data.leads.length === 1}
				<p class="leads-intro">
					We have received your solar inquiry. Our team will contact you soon with quotations from
					verified installers.
				</p>
			{:else}
				<p class="leads-intro">
					You have submitted {data.leads.length} solar inquiries. We will contact you soon with quotations
					from verified installers.
				</p>
			{/if}

			<div class="leads-container">
				{#each data.leads as lead (lead.id)}
					<div class="lead-card">
						<div class="lead-header">
							<span class="lead-date">Submitted on {formatDate(lead.submittedAt)}</span>
						</div>

						<div class="lead-details">
							<div class="detail-row">
								<span class="label">Name:</span>
								<span class="value">{lead.name}</span>
							</div>
							<div class="detail-row">
								<span class="label">Phone:</span>
								<span class="value">{lead.phone}</span>
							</div>
							<div class="detail-row">
								<span class="label">Email:</span>
								<span class="value">{lead.email || 'Not provided'}</span>
							</div>
							<div class="detail-row">
								<span class="label">Location:</span>
								<span class="value">{lead.pinCode}{lead.district ? `, ${lead.district}` : ''}</span>
							</div>
							<div class="detail-row">
								<span class="label">Installation Type:</span>
								<span class="value">{lead.type}</span>
							</div>
							<div class="detail-row">
								<span class="label">Requirements:</span>
								<span class="value">{lead.comment}</span>
							</div>
						</div>

						<div class="lead-bill-upload">
							<BillUpload leadId={lead.id} billUrl={lead.billUrl} billFormat={lead.billFormat} />
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="no-leads">You haven't submitted any solar inquiries yet.</p>
			<p class="cta-text">
				Ready to go solar? Submit your requirements and get quotes from verified installers!
			</p>
		{/if}
	</section>

	<section class="dashboard-content interest-received-section">
		<h2>Interest Received</h2>

		{#if data.claimedBusinesses && data.claimedBusinesses.length > 0}
			<p class="leads-intro">
				{#if data.claimedBusinesses.length === 1}
					1 installer has shown interest in your inquiry.
				{:else}
					{data.claimedBusinesses.length} installers have shown interest in your inquiries.
				{/if}
			</p>

			<div class="claims-container">
				{#each data.leads as lead (lead.id)}
					{@const claimsForLead = claimsGroupedByLead.get(lead.id) || []}
					{#if claimsForLead.length > 0}
						<div class="interest-group">
							<div class="interest-group-header">
								<h3>For your inquiry submitted on {formatDate(lead.submittedAt)}</h3>
								<span class="interest-count-badge"
									>{claimsForLead.length}
									{claimsForLead.length === 1 ? 'installer' : 'installers'} interested</span
								>
							</div>

							<div class="business-claims-list">
								{#each claimsForLead as claim}
									<div class="business-claim-card">
										<div class="business-claim-header">
											<div class="business-info">
												<h4 class="business-name">{claim.businessName}</h4>
												<p class="business-location">
													{claim.businessDistrict}, {claim.businessState}
												</p>
											</div>
											<span class="interest-date">
												Interested on {formatDate(claim.interestReceivedAt)}
											</span>
										</div>

										<div class="business-claim-details">
											<div class="claim-status-row">
												<div class="status-item">
													<span class="status-label">Status:</span>
													<span class="status-badge stage-{claim.stage}">
														{getStageLabel(claim.stage)}
													</span>
												</div>
												{#if claim.businessPhone}
													<div class="status-item">
														<span class="status-label">Contact:</span>
														<a href="tel:{claim.businessPhone}" class="business-contact-link">
															{claim.businessPhone}
														</a>
													</div>
												{/if}
											</div>
											{#if claim.businessSlug}
												<div class="business-actions">
													<a
														href="/solar-panel-installer/{claim.businessSlug}"
														target="_blank"
														class="view-profile-btn"
													>
														View Installer Profile
													</a>
												</div>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<p class="no-interest">
				No installers have shown interest yet. We're matching your inquiry with qualified installers
				in your area.
			</p>
		{/if}
	</section>
	{/if}
</main>

<style>
	/* Local aliases onto the shared token layer in src/app.css. Svelte does not
	   scope :root, so these leak globally — --shadow-sm/md/lg and --transition-fast
	   /-slow are deliberately not redefined here, because app.css already owns
	   those names and redefining them would override the shared values app-wide. */
	:root {
		/* Colors */
		--primary-color: hsl(var(--primary));
		--primary-light: hsl(var(--accent-muted));
		--secondary-color: hsl(var(--secondary));
		--accent-color: hsl(var(--warning));

		/* Text colors */
		--text-dark: hsl(var(--foreground));
		--text-medium: hsl(var(--foreground-secondary));
		--text-light: hsl(var(--primary-foreground));

		/* Theme colors */
		--light-bg-color: hsl(var(--background));
		--dark-bg-color: hsl(var(--background));
		--light-card-bg: hsl(var(--card));
		--dark-card-bg: hsl(var(--card));

		/* UI elements */
		--border-radius-sm: var(--radius-sm);
		--border-radius-md: var(--radius-md);
		--border-radius-lg: var(--radius-lg);

		/* Typography */
		--font-family: var(--font-sans);
		--heading-line-height: 1.2;
		--body-line-height: 1.6;

		/* Layout */
		--section-padding: 2rem 1.5rem;
		--container-width: 1140px;
		--grid-gap: 1.5rem;

		/* Transitions (--transition-fast/-slow come from app.css) */
		--transition-medium: 0.3s ease;
	}

	/* Base styles */
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	main {
		width: 100%;
		font-family: var(--font-family);
		line-height: var(--body-line-height);
		overflow-x: hidden;
		transition:
			background-color var(--transition-medium),
			color var(--transition-medium);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		min-height: 100vh;
		background-color: var(--light-bg-color);
		color: var(--text-dark);
	}

	main > section {
		max-width: var(--container-width);
		width: 100%;
		margin-bottom: 2.5rem;
	}

	/* Section styling */
	section {
		padding: var(--section-padding);
		transition: background-color var(--transition-medium);
	}

	/* Login section */
	.login-section {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: var(--section-padding);
		width: 100%;
		max-width: var(--container-width);
	}

	.login-card {
		background: var(--light-card-bg);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		padding: 2.5rem 2rem;
		width: 100%;
		max-width: 440px;
	}

	.login-card h1 {
		font-size: 1.8rem;
		color: hsl(var(--primary-strong));
		margin-bottom: 0.75rem;
	}

	.login-subtitle {
		color: var(--text-dark);
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	.login-hint {
		color: var(--text-medium);
		font-size: 0.9rem;
		margin: 0;
	}

	/* Welcome section with gradient background */
	/* No orange fill and no gradient here: main-app opens a page with the heading
	   and a short orange rule sitting straight on the cream background, and a
	   full-bleed orange block is the one thing it never does. */
	.welcome-section {
		text-align: center;
		padding: 2.5rem 2rem 2rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: hsl(var(--primary-strong));
		line-height: var(--heading-line-height);
	}

	/* The heading divider main-app draws with PageHeader; user-app has no such
	   component, so it is a pseudo-element here. */
	.welcome-section h1::after,
	.dashboard-content h2::after {
		content: '';
		display: block;
		width: var(--divider-line-width);
		height: var(--divider-line-height);
		margin: 1rem auto 0;
		background: hsl(var(--accent));
		border-radius: var(--radius-xs);
	}

	.dashboard-content h2::after {
		margin-left: 0;
		margin-right: 0;
	}

	.email {
		font-size: 1.1rem;
		margin: 0;
		color: hsl(var(--foreground-secondary));
	}

	.logout-form {
		margin-top: 1.25rem;
	}

	.logout-btn {
		background: hsl(var(--card));
		color: hsl(var(--foreground));
		border: 1px solid hsl(var(--border));
		padding: 0.45rem 1.25rem;
		border-radius: var(--border-radius-sm);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: background var(--transition-fast);
	}

	.logout-btn:hover {
		background: hsl(var(--background-tertiary));
	}

	/* Dashboard content section */
	/* main-app's cards are flat and bordered, not shadowed — --shadow-card is
	   `none` in light and a soft lift in dark, so this flips with the theme. */
	.dashboard-content {
		padding: var(--section-padding);
		border-radius: var(--border-radius-lg);
		background-color: var(--light-card-bg);
		border: 1px solid hsl(var(--border));
		box-shadow: var(--shadow-card);
		transition: box-shadow var(--transition-medium);
	}

	.dashboard-content:hover {
		box-shadow: var(--shadow-card-hover);
	}

	h2 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: hsl(var(--primary-strong));
	}

	p {
		font-size: 1rem;
		margin-bottom: 0.75rem;
		line-height: 1.6;
		color: var(--text-medium);
	}

	/* Leads intro text */
	.leads-intro {
		text-align: center;
		font-size: 1.1rem;
		margin-bottom: 2rem;
		color: var(--text-medium);
	}

	/* No leads message */
	.no-leads {
		text-align: center;
		font-size: 1.2rem;
		color: var(--text-medium);
		margin-bottom: 1rem;
	}

	.cta-text {
		text-align: center;
		font-size: 1rem;
		color: var(--primary-color);
		font-weight: 500;
	}

	/* Leads container */
	.leads-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--grid-gap);
		margin-top: 1.5rem;
	}

	/* Individual lead card */
	.lead-card {
		background-color: var(--light-card-bg);
		border-radius: var(--border-radius-md);
		box-shadow: var(--shadow-sm);
		border: 1px solid hsl(var(--border));
		transition:
			box-shadow var(--transition-medium),
			transform var(--transition-medium);
		overflow: hidden;
		width: 100%;
		max-width: 600px;
	}

	.lead-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	/* Lead card header */
	.lead-header {
		background: hsl(var(--background-secondary));
		color: hsl(var(--foreground));
		border-bottom: 1px solid hsl(var(--border));
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.lead-date {
		font-size: 1rem;
		font-weight: 500;
		color: hsl(var(--foreground-secondary));
	}

	/* Lead details section */
	.lead-details {
		padding: 1.5rem;
	}

	.lead-bill-upload {
		padding: 0 1.5rem 1rem;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.75rem 0;
		border-bottom: 1px solid hsl(var(--border));
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 600;
		color: hsl(var(--foreground-secondary));
		min-width: 140px;
		flex-shrink: 0;
		font-size: 0.95rem;
	}

	.value {
		font-weight: 500;
		color: hsl(var(--foreground));
		text-align: right;
		flex-grow: 1;
		word-wrap: break-word;
		margin-left: 1rem;
		font-size: 0.95rem;
	}

	/* Interest Received Section */
	.interest-received-section {
		margin-top: 2rem;
	}

	.no-interest {
		text-align: center;
		font-size: 1.1rem;
		color: var(--text-medium);
		margin: 2rem 0;
		font-style: italic;
	}

	.claims-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-top: 1.5rem;
	}

	/* Interest Group */
	.interest-group {
		border: 1px solid hsl(var(--border));
		border-radius: var(--border-radius-md);
		overflow: hidden;
		background-color: hsl(var(--background-secondary));
		box-shadow: var(--shadow-sm);
	}

	.interest-group-header {
		background: hsl(var(--success-muted));
		color: hsl(var(--foreground));
		border-bottom: 1px solid hsl(var(--success) / 0.35);
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.interest-group-header h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0;
		color: hsl(var(--secondary-foreground));
	}

	.interest-count-badge {
		background-color: hsl(var(--success));
		color: hsl(var(--secondary-foreground));
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		font-size: 0.85rem;
		font-weight: 600;
		white-space: nowrap;
	}

	/* Business Claims List */
	.business-claims-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	/* Business Claim Card */
	.business-claim-card {
		background-color: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: var(--border-radius-md);
		overflow: hidden;
		transition:
			box-shadow var(--transition-medium),
			transform var(--transition-medium);
	}

	.business-claim-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	.business-claim-header {
		padding: 1.25rem;
		border-bottom: 1px solid hsl(var(--border));
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.business-info {
		flex: 1;
	}

	.business-name {
		font-size: 1.2rem;
		font-weight: 600;
		color: hsl(var(--primary-strong));
		margin: 0 0 0.5rem 0;
	}

	.business-location {
		font-size: 0.9rem;
		color: var(--text-medium);
		margin: 0;
		font-style: italic;
	}

	.interest-date {
		font-size: 0.85rem;
		color: var(--text-medium);
		white-space: nowrap;
	}

	/* Business Claim Details */
	.business-claim-details {
		padding: 1.25rem;
	}

	.claim-status-row {
		display: flex;
		gap: 2rem;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-label {
		font-weight: 600;
		color: hsl(var(--foreground-secondary));
		font-size: 0.9rem;
	}

	.status-badge {
		padding: 0.3rem 0.8rem;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 600;
		color: hsl(var(--primary-foreground));
	}

	.status-badge.stage-0 {
		background-color: hsl(var(--foreground-secondary));
		color: hsl(var(--background));
	}

	.status-badge.stage-1 {
		background-color: hsl(var(--warning));
		color: hsl(var(--warning-foreground));
	}

	.status-badge.stage-2 {
		background-color: hsl(var(--primary));
	}

	.status-badge.stage-3 {
		background-color: hsl(var(--success));
		color: hsl(var(--secondary-foreground));
	}

	.business-contact-link {
		color: hsl(var(--primary-strong));
		text-decoration: none;
		font-weight: 600;
		font-size: 0.95rem;
		transition: color var(--transition-fast);
	}

	.business-contact-link:hover {
		color: hsl(var(--primary));
		text-decoration: underline;
	}

	/* Business Actions */
	.business-actions {
		margin-top: 1rem;
	}

	.view-profile-btn {
		display: inline-block;
		padding: 0.6rem 1.25rem;
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		text-decoration: none;
		border-radius: var(--border-radius-sm);
		font-weight: 600;
		font-size: 0.95rem;
		transition:
			transform var(--transition-fast),
			box-shadow var(--transition-fast);
		box-shadow: var(--shadow-sm);
	}

	.view-profile-btn:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	/* Responsive design */
	@media (max-width: 992px) {
		h1 {
			font-size: 2.2rem;
		}

		h2 {
			font-size: 1.6rem;
		}
	}

	@media (max-width: 768px) {
		section {
			padding: 1.5rem 1rem;
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.4rem;
		}

		.welcome-section {
			padding: 2rem 1.5rem;
		}

		.detail-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}

		.label {
			min-width: auto;
			font-size: 0.9rem;
		}

		.value {
			text-align: left;
			margin-left: 0;
			font-size: 0.95rem;
		}

		.interest-group-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.business-claim-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.interest-date {
			white-space: normal;
		}

		.claim-status-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}

	@media (max-width: 576px) {
		main {
			padding: 1rem 0.5rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		h2 {
			font-size: 1.3rem;
		}

		.welcome-section {
			padding: 1.5rem 1rem;
		}

		.dashboard-content {
			padding: 1.5rem 1rem;
		}

		.lead-details {
			padding: 1rem;
		}

		.leads-intro,
		.no-leads {
			font-size: 1rem;
		}

		.interest-group-header h3 {
			font-size: 1rem;
		}

		.business-name {
			font-size: 1.1rem;
		}

		.business-claims-list {
			padding: 0.75rem;
		}

		.business-claim-header,
		.business-claim-details {
			padding: 1rem;
		}
	}
</style>
