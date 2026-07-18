<script>
	import BillUpload from '$lib/components/BillUpload.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	function formatDate(dateString) {
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

	function getStageLabel(stage) {
		const stages = {
			0: 'New Inquiry',
			1: 'Qualified',
			2: 'Proposal Sent',
			3: 'Won'
		};
		return stages[stage] || 'Under Review';
	}

	function groupClaimsByLead(claimedBusinesses) {
		const grouped = new Map();
		claimedBusinesses.forEach((claim) => {
			const key = claim.originalLeadId;
			if (!grouped.has(key)) grouped.set(key, []);
			grouped.get(key).push(claim);
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
	/* Root variables using custom properties */
	:root {
		/* Colors */
		--primary-color: #0056b3;
		--primary-hover: #004494;
		--primary-light: #e6f0ff;
		--secondary-color: #4caf50;
		--accent-color: #ffc107;

		/* Text colors */
		--text-dark: #2c3e50;
		--text-medium: #546e7a;
		--text-light: #ecf0f1;

		/* Theme colors */
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a202c;
		--light-card-bg: #ffffff;
		--dark-card-bg: #2d3748;

		/* UI elements */
		--border-radius-sm: 4px;
		--border-radius-md: 8px;
		--border-radius-lg: 16px;
		--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
		--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
		--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

		/* Typography */
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
		--heading-line-height: 1.2;
		--body-line-height: 1.6;

		/* Layout */
		--section-padding: 2rem 1.5rem;
		--container-width: 1140px;
		--grid-gap: 1.5rem;

		/* Transitions */
		--transition-fast: 0.2s ease;
		--transition-medium: 0.3s ease;
		--transition-slow: 0.5s ease;
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
		color: var(--primary-color);
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
	.welcome-section {
		text-align: center;
		padding: 3rem 2rem;
		background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
		color: white;
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: white;
		line-height: var(--heading-line-height);
	}

	.email {
		font-size: 1.1rem;
		opacity: 0.9;
		margin: 0;
		color: rgba(255, 255, 255, 0.9);
	}

	.logout-form {
		margin-top: 1.25rem;
	}

	.logout-btn {
		background: rgba(255, 255, 255, 0.15);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.5);
		padding: 0.45rem 1.25rem;
		border-radius: var(--border-radius-sm);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: background var(--transition-fast);
	}

	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.28);
	}

	/* Dashboard content section */
	.dashboard-content {
		padding: var(--section-padding);
		border-radius: var(--border-radius-lg);
		background-color: var(--light-card-bg);
		box-shadow: var(--shadow-md);
		transition: box-shadow var(--transition-medium);
	}

	.dashboard-content:hover {
		box-shadow: var(--shadow-lg);
	}

	h2 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--primary-color);
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
		border: 1px solid #e2e8f0;
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
		background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
		color: white;
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.lead-date {
		font-size: 1rem;
		font-weight: 500;
		color: white;
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
		border-bottom: 1px solid #f1f5f9;
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 600;
		color: #475569;
		min-width: 140px;
		flex-shrink: 0;
		font-size: 0.95rem;
	}

	.value {
		font-weight: 500;
		color: #1e293b;
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
		border: 1px solid #e2e8f0;
		border-radius: var(--border-radius-md);
		overflow: hidden;
		background-color: #f8fafc;
		box-shadow: var(--shadow-sm);
	}

	.interest-group-header {
		background: linear-gradient(135deg, #4caf50, #388e3c);
		color: white;
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
		color: white;
	}

	.interest-count-badge {
		background-color: rgba(255, 255, 255, 0.2);
		color: white;
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
		background-color: white;
		border: 1px solid #e2e8f0;
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
		border-bottom: 1px solid #f1f5f9;
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
		color: var(--primary-color);
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
		color: #475569;
		font-size: 0.9rem;
	}

	.status-badge {
		padding: 0.3rem 0.8rem;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 600;
		color: white;
	}

	.status-badge.stage-0 {
		background-color: #17a2b8;
	}

	.status-badge.stage-1 {
		background-color: #ffc107;
		color: #333;
	}

	.status-badge.stage-2 {
		background-color: #0056b3;
	}

	.status-badge.stage-3 {
		background-color: #28a745;
	}

	.business-contact-link {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.95rem;
		transition: color var(--transition-fast);
	}

	.business-contact-link:hover {
		color: var(--primary-hover);
		text-decoration: underline;
	}

	/* Business Actions */
	.business-actions {
		margin-top: 1rem;
	}

	.view-profile-btn {
		display: inline-block;
		padding: 0.6rem 1.25rem;
		background: linear-gradient(135deg, var(--primary-color), #0a4b9e);
		color: white;
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
