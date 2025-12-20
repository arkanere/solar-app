<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';

	const businessSlug = $page.params.business_slug;
	$: darkMode = $isDarkMode;
	$: ({ leads = [], business } = $page.data);

	// Function to calculate days ago
	function getDaysAgo(dateString) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now - date;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			return 'Today';
		} else if (diffInDays === 1) {
			return '1 day ago';
		} else {
			return `${diffInDays} days ago`;
		}
	}

	// Function to show instructions for getting the inquiry
	function showInquiryInstructions(lead) {
		alert(
			`To get this inquiry in ${lead.district}, ${lead.state}:\n\n1. Add a branch in any city within ${lead.district} district\n2. Once the branch is added, the lead will appear in your business dashboard home page. From there you can claim it\n\nClick on "Add Branch" in the sidebar to get started.`
		);
	}
</script>

<svelte:head>
	<title>Open Inquiries - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<div class="page-content {darkMode ? 'dark' : 'light'}">
	<header>
		<h1>Open Inquiries</h1>
		<p>Browse available customer inquiries in different districts</p>
	</header>

	<section id="inquiries-section">
		{#if leads.length === 0}
			<div class="no-inquiries">
				<p>No open inquiries available at the moment.</p>
				<p class="hint">Check back later for new opportunities!</p>
			</div>
		{:else}
			<div class="inquiries-grid">
				{#each leads as lead}
					<div class="inquiry-card">
						<div class="inquiry-header">
							<span class="district-badge">{lead.district}, {lead.state}</span>
							<span class="date-badge">{getDaysAgo(lead.created_at)}</span>
						</div>
						<div class="inquiry-content">
							{#if lead.pin_code}
								<div class="info-row">
									<span class="label">Pin Code:</span>
									<span class="value">{lead.pin_code}</span>
								</div>
							{/if}
							{#if lead.comment}
								<div class="info-row comment">
									<span class="label">Comment:</span>
									<span class="value">{lead.comment}</span>
								</div>
							{/if}
							{#if lead.sv_comment_for_businesses}
								<div class="info-row comment">
									<span class="label">SV Note:</span>
									<span class="value">{lead.sv_comment_for_businesses}</span>
								</div>
							{/if}
						</div>
						<div class="inquiry-actions">
							<button class="btn info-btn" on:click={() => showInquiryInstructions(lead)}>
								How to Get This Inquiry
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--info-color: #17a2b8;
	}

	.page-content {
		min-height: 100vh;
		font-family: var(--font-family);
		padding: 2rem;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	.page-content.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.page-content.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: var(--accent-color);
	}

	.dark header h1 {
		color: #66b2ff;
	}

	header p {
		opacity: 0.8;
	}

	.inquiries-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.inquiry-card {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s ease;
	}

	.inquiry-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.dark .inquiry-card {
		background: #2a2a2a;
	}

	.inquiry-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.district-badge {
		background: var(--accent-color);
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.date-badge {
		background: #e9ecef;
		color: #495057;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
	}

	.dark .date-badge {
		background: #444;
		color: #ccc;
	}

	.inquiry-content {
		margin-bottom: 1rem;
	}

	.info-row {
		display: flex;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}

	.info-row.comment {
		flex-direction: column;
	}

	.label {
		font-weight: 600;
		margin-right: 0.5rem;
		min-width: 80px;
	}

	.value {
		opacity: 0.8;
	}

	.inquiry-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background-color 0.3s ease;
		width: 100%;
	}

	.info-btn {
		background: var(--info-color);
		color: white;
	}

	.info-btn:hover {
		background: #138496;
	}

	.no-inquiries {
		text-align: center;
		padding: 3rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.dark .no-inquiries {
		background: #2a2a2a;
	}

	.hint {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		opacity: 0.7;
	}

	@media (max-width: 768px) {
		.page-content {
			padding: 1rem;
		}

		.inquiries-grid {
			grid-template-columns: 1fr;
		}

		header h1 {
			font-size: 1.5rem;
		}
	}
</style>
