<script>
	import { page } from '$app/stores';

	const labels = {
		'in': 'India Portal',
		'us': 'US Portal',
		'blogs': 'Blogs',
		'create': 'Create',
		'edit': 'Edit',
		'allbusinesses': 'All Businesses',
		'businesses': 'Businesses',
		'queries': 'Queries',
		'leaddata': 'Lead Data',
		'leaddata-nonexclusive': 'Non-Exclusive Lead Data',
		'lead-claimsdata': 'Lead Claims Data',
		'analytics': 'Analytics',
		'business-login': 'Business Login',
		'businesses-branches': 'Branches',
		'businesses-statewise': 'Statewise',
		'coverage': 'Coverage',
		'lead-generation': 'Lead Generation',
		'leads-claimed': 'Leads Claimed',
		'recent-projects': 'Recent Projects',
		'spread': 'Spread',
		'control-tower': 'Control Tower',
		'eligible-businesses': 'Eligible Businesses',
		'eligible-leads': 'Eligible Leads',
		'serverlogs': 'Server Logs',
		'business-onboarding': 'Business Onboarding',
		'find-businesses': 'Find Businesses',
		'invitation-email-campaign': 'Invitation Email Campaign',
		'login': 'Login'
	};

	function getLabel(segment) {
		return labels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	}

	function isUuid(segment) {
		return /^[0-9a-f]{8}-/.test(segment) || /^\d+$/.test(segment);
	}

	$: segments = $page.url.pathname.split('/').filter(Boolean);
	$: crumbs = segments.map((segment, i) => ({
		label: isUuid(segment) ? `#${segment}` : getLabel(segment),
		href: '/' + segments.slice(0, i + 1).join('/')
	}));
</script>

{#if crumbs.length > 0}
	<nav class="breadcrumb" aria-label="Breadcrumb">
		<a href="/">Home</a>
		{#each crumbs as crumb, i}
			<span class="separator">/</span>
			{#if i === crumbs.length - 1}
				<span class="current">{crumb.label}</span>
			{:else}
				<a href={crumb.href}>{crumb.label}</a>
			{/if}
		{/each}
	</nav>
{/if}

<style>
	.breadcrumb {
		padding: 12px 20px;
		font-size: 13px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		color: #666;
	}

	.breadcrumb a {
		color: #0077cc;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.separator {
		margin: 0 6px;
		color: #ccc;
	}

	.current {
		color: #333;
		font-weight: 500;
	}

	:global(.dark) .breadcrumb {
		color: #aaa;
	}

	:global(.dark) .breadcrumb a {
		color: #66b2ff;
	}

	:global(.dark) .separator {
		color: #555;
	}

	:global(.dark) .current {
		color: #e0e0e0;
	}
</style>
