<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/us/themeStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import LeadFormBusiness from '$lib/us/LeadFormBusiness.svelte';
	import SolarSizeCalculator from '$lib/us/SolarSizeCalculator.svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import AboutSolarVipani from '$lib/us/AboutSolarVipani.svelte';
	import { formatCityStateUrl } from '$lib/us/stateAbbreviations';

	// Destructure page data with reactive declaration
	$: ({ business, errorMessage } = $page.data);
	$: darkMode = $isDarkMode;
	$: businessSlug = business?.slug || '';
	$: showProjects = business?.businessfilled && business?.tier3;

	// Function to make call with Umami tracking
	function makeCall(phoneNumber, businessSlug) {
		// Track Umami event after hydration
		if (typeof window !== 'undefined' && window.umami) {
			window.umami.track(`call-now-button-${businessSlug}`);
		}
		window.location.href = `tel:${phoneNumber}`;
	}

	// Function to open WhatsApp with Umami tracking
	function openWhatsApp(phoneNumber, businessSlug) {
		// Track Umami event after hydration
		if (typeof window !== 'undefined' && window.umami) {
			window.umami.track(`whatsapp-button-${businessSlug}`);
		}
		window.location.href = `https://wa.me/1${phoneNumber.replace(/\D/g, '')}`;
	}

	// Service mappings as a constant object outside component for better performance
	const SERVICE_MAPPING = {
		1: 'Solar Panel Installation',
		2: 'Net Metering',
		3: 'Subsidy Documentation',
		4: 'Financing',
		5: 'Cleaning of Solar Panels',
		6: 'Agricultural Solar Installation'
	};

	// Helper functions
	const getServiceNames = (serviceIds) =>
		serviceIds?.map((id) => SERVICE_MAPPING[id] || 'Unknown Service').join(', ') || '';

	const navigateToLogin = () => {
		goto(`/business/login`);
	};
	const navigateToClaim = () => businessSlug && goto(`/business/${businessSlug}/claim`);
	const navigateToDirectory = () =>
		business?.city &&
		business?.state &&
		goto(
			`/us/solar-panel-installer-directory/${formatCityStateUrl(business.city, business.state)}`
		);

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-IN', options);
	};

	// Recent Projects state
	let projects = [];
	let projectsLoading = true;
	let projectsError = null;

	// Fetch recent projects
	async function fetchRecentProjects() {
		if (!businessSlug) return;

		try {
			projectsLoading = true;
			projectsError = null;

			const response = await fetch(
				`/api/getRecentProjectsByBusiness?business_slug=${businessSlug}`
			);

			if (!response.ok) {
				throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();

			if (result.success) {
				// Handle both array and single project responses
				projects = Array.isArray(result.projects)
					? result.projects
					: result.projects
						? [result.projects]
						: [];
			} else {
				projectsError = result.error || 'Failed to fetch projects';
			}
		} catch (err) {
			projectsError = err.message || 'Something went wrong';
			console.error('Error fetching projects:', err);
		} finally {
			projectsLoading = false;
		}
	}

	// Load projects on mount if conditions are met
	onMount(() => {
		if (showProjects) {
			fetchRecentProjects();
		}
	});
</script>

<svelte:head>
	<title>{business?.businessname || 'Business Not Found'} | Directory Listing - Solar Vipani</title>
	<meta
		name="description"
		content={business
			? `Get complete details about ${business.businessname} on Solar Vipani. View contact info, address. Directly reach out to the business to know solar panel price, site visit`
			: 'The requested business was not found on Solar Vipani.'}
	/>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	{#if business}
		<!-- Business Login (for business owners) -->
		<div class="business-owner-section">
			<button
				class="business-login-btn"
				on:click={business.businessfilled ? navigateToLogin : navigateToClaim}
				title={business.businessfilled ? 'Business owner login' : 'Claim this business listing'}
			>
				{business.businessfilled ? 'Business Login' : 'Claim Business'}
			</button>
		</div>

		<!-- Hero Section -->
		<div class="hero-section">
			<h1>{business.businessname}</h1>
			{#if business.businessfilled && business.tag !== 'Blank'}
				<div class="business-tag">{business.tag}</div>
			{/if}
			{#if business.phonenumber}
				<div class="hero-actions">
					<button
						class="call-now-button-hero"
						on:click={() => makeCall(business.phonenumber, business.slug)}
					>
						<span class="button-icon phone-button-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
								></path>
							</svg>
						</span>
						<span>CALL NOW</span>
					</button>
					<button
						class="whatsapp-button-hero"
						on:click={() => openWhatsApp(business.phonenumber, business.slug)}
					>
						<span class="button-icon whatsapp-button-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.345"
								/>
							</svg>
						</span>
						<span>WHATSAPP</span>
					</button>
				</div>
			{/if}
		</div>

		<!-- Business Details - Single Combined Card -->
		<div class="business-details-container">
			<div class="business-info-card">
				<div class="card-header">
					<div class="card-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
							<polyline points="9,22 9,12 15,12 15,22"></polyline>
						</svg>
					</div>
					<h3>Business Information</h3>
				</div>

				<div class="business-info-content">
					<!-- Description Section -->
					{#if business.businessfilled && business.description}
						<div class="info-section">
							<h4 class="section-title">About</h4>
							<p class="description-text">{business.description}</p>
						</div>
					{/if}

					<!-- Services Section -->
					{#if business.businessfilled && business.services && business.services.length > 0}
						<div class="info-section">
							<h4 class="section-title">Services</h4>
							<div class="services-list">
								{#each business.services as serviceId}
									<span class="service-tag">{SERVICE_MAPPING[serviceId] || 'Unknown Service'}</span>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Contact & Location Combined -->
					<div class="contact-location-grid">
						<!-- Contact Information -->
						<div class="info-section">
							<h4 class="section-title">Contact Information</h4>
							<div class="contact-details">
								{#if business.phonenumber}
									<div class="detail-item">
										<span class="detail-icon">📞</span>
										<div class="detail-content">
											<span class="detail-label">Phone:</span>
											<a href="tel:{business.phonenumber}" class="detail-value phone-link"
												>{business.phonenumber}</a
											>
										</div>
									</div>
								{/if}
								{#if business.email}
									<div class="detail-item">
										<span class="detail-icon">📧</span>
										<div class="detail-content">
											<span class="detail-label">Email:</span>
											<a href="mailto:{business.email}" class="detail-value email-link"
												>{business.email}</a
											>
										</div>
									</div>
								{/if}
								{#if business.website}
									<div class="detail-item">
										<span class="detail-icon">🌐</span>
										<div class="detail-content">
											<span class="detail-label">Website:</span>
											<a
												href={business.website}
												target="_blank"
												rel="noopener noreferrer"
												class="detail-value website-link">{business.website}</a
											>
										</div>
									</div>
								{/if}
							</div>
						</div>

						<!-- Location Information -->
						<div class="info-section">
							<h4 class="section-title">Location</h4>
							<div class="location-details">
								{#if business.address}
									<div class="detail-item">
										<span class="detail-icon">📍</span>
										<div class="detail-content">
											<span class="detail-label">Address:</span>
											<span class="detail-value">{business.address}</span>
										</div>
									</div>
								{/if}
								{#if business.city}
									<div class="detail-item">
										<span class="detail-icon">🏙️</span>
										<div class="detail-content">
											<span class="detail-label">City:</span>
											<span class="detail-value">{business.city}</span>
										</div>
									</div>
								{/if}
								{#if business.state}
									<div class="detail-item">
										<span class="detail-icon">🗺️</span>
										<div class="detail-content">
											<span class="detail-label">State:</span>
											<span class="detail-value">{business.state}</span>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Projects Section -->
		{#if showProjects}
			<section class="recent-projects">
				<h2>Recent Solar Panel Installation Projects</h2>

				{#if projectsLoading}
					<div class="loading">Loading recent projects...</div>
				{:else if projectsError}
					<div class="error">
						<p>Error: {projectsError}</p>
						<button on:click={fetchRecentProjects}>Try Again</button>
					</div>
				{:else if projects.length === 0}
					<div class="no-projects">No recent projects found for this business.</div>
				{:else}
					<div class="projects-grid">
						{#each projects as project (project.id)}
							<div class="project-card">
								<a
									href="/us/solar-panel-installer/{businessSlug}/project/{project.project_slug}"
									class="project-link"
								>
									<div class="project-image">
										{#if project.cloudinary_public_id}
											<img
												src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_200,q_auto,f_auto/${project.cloudinary_public_id}`}
												alt={project.title}
												loading="lazy"
											/>
										{:else if project.image_url}
											<img src={project.image_url} alt={project.title} loading="lazy" />
										{:else}
											<div class="no-image">No Image</div>
										{/if}
									</div>

									<div class="project-details">
										<h3>{project.title}</h3>
										<p class="location">Pincode: {project.pincode}</p>
										<p class="date">Completed on: {formatDate(project.project_date)}</p>
										{#if project.system_size}
											<p class="system-size">System Size: {project.system_size} kW</p>
										{/if}
									</div>
								</a>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<h2>Book Free Consultation To Know Price from {business.businessname}</h2>
			<LeadFormBusiness />
		{/if}

		<!-- Solar Size Calculator Component -->
		<SolarSizeCalculator />

		<!-- Other Businesses in the City -->
		{#if business.city}
			<section class="other-businesses">
				<h2>Find Other Solar Businesses in {business.city}</h2>
				<p>
					If you're interested in exploring other solar businesses in {business.city}, visit our
					directory page.
				</p>
				<button on:click={navigateToDirectory}>
					View Solar Businesses in {business.city}
				</button>
			</section>
		{/if}
	{:else if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else}
		<p>Loading...</p>
	{/if}

	<!-- About Solarvipani -->
	<div class="about-container">
		<AboutSolarVipani />
	</div>
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
	}

	main > * {
		max-width: var(--container-width);
		width: 100%;
		margin-bottom: 2rem;
	}

	/* Theme styling */
	.light {
		background-color: var(--light-bg-color);
		color: var(--text-dark);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--text-light);
	}

	/* Section styling */
	section {
		padding: var(--section-padding);
		transition: background-color var(--transition-medium);
		background-color: var(--light-card-bg);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
	}

	.dark section {
		background-color: var(--dark-card-bg);
	}

	/* Typography */
	h1 {
		font-size: 2.2rem;
		margin-bottom: 1rem;
		font-weight: 600;
		text-align: center;
		color: var(--primary-color);
	}

	.dark h1 {
		color: var(--primary-light);
	}

	h2 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--primary-color);
		text-align: center;
	}

	.dark h2 {
		color: var(--primary-light);
	}

	p {
		font-size: 1rem;
		margin-bottom: 0.75rem;
		line-height: 1.6;
		color: var(--text-medium);
	}

	.dark p {
		color: #cbd5e0;
	}

	/* Button styling */
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border: none;
		border-radius: var(--border-radius-sm);
		cursor: pointer;
		transition:
			background-color var(--transition-fast),
			transform var(--transition-fast);
		background-color: var(--accent-color);
		color: white;
		margin-bottom: 1rem;
	}

	button:hover {
		background-color: var(--primary-hover);
		transform: translateY(-2px);
	}

	/* Utility classes */
	.error-message {
		color: #e53e3e;
		font-size: 1.1rem;
		font-weight: 600;
	}

	/* Business Owner Section - Subtle and unobtrusive */
	.business-owner-section {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;
		padding: 0 1rem;
	}

	.business-login-btn {
		background-color: transparent;
		color: var(--text-medium);
		border: 1px solid rgba(0, 0, 0, 0.2);
		font-size: 0.85rem;
		font-weight: 400;
		padding: 0.5rem 1rem;
		border-radius: var(--border-radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		opacity: 0.7;
	}

	.dark .business-login-btn {
		color: #a0aec0;
		border-color: rgba(255, 255, 255, 0.2);
	}

	.business-login-btn:hover {
		background-color: rgba(0, 0, 0, 0.05);
		opacity: 1;
		transform: none;
	}

	.dark .business-login-btn:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		padding: 3rem 2rem;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
		border-radius: var(--border-radius-lg);
		color: white;
		margin-bottom: 2rem;
		position: relative;
		overflow: hidden;
	}

	.hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
		pointer-events: none;
	}

	.dark .hero-section {
		background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
	}

	.hero-section h1 {
		color: white;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		position: relative;
		z-index: 1;
	}

	.business-tag {
		display: inline-flex;
		align-items: center;
		color: #22c55e;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 1.5rem;
		position: relative;
	}

	.business-tag::before {
		content: '✓';
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		background-color: #22c55e;
		color: white;
		border-radius: 50%;
		font-size: 0.6rem;
		font-weight: bold;
		margin-right: 0.4rem;
	}

	.dark .business-tag {
		color: #4ade80;
	}

	.dark .business-tag::before {
		background-color: #4ade80;
	}

	.hero-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		position: relative;
		z-index: 1;
		flex-wrap: wrap;
	}

	.call-now-button-hero {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: linear-gradient(135deg, #ff6b35 0%, #f94449 100%);
		color: white;
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.8px;
		text-transform: uppercase;
		padding: 1rem 2rem;
		border-radius: var(--border-radius-md);
		border: none;
		cursor: pointer;
		transition: all var(--transition-medium);
		box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
		width: 160px;
		justify-content: center;
	}

	.call-now-button-hero:hover {
		background: linear-gradient(135deg, #f94449 0%, #ff6b35 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
	}

	.phone-button-icon,
	.whatsapp-button-icon {
		display: flex;
		align-items: center;
	}

	.whatsapp-button-hero {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: linear-gradient(135deg, #25d366 0%, #20c858 100%);
		color: white;
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.8px;
		text-transform: uppercase;
		padding: 1rem 2rem;
		border-radius: var(--border-radius-md);
		border: none;
		cursor: pointer;
		transition: all var(--transition-medium);
		box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
		width: 160px;
		justify-content: center;
	}

	.whatsapp-button-hero:hover {
		background: linear-gradient(135deg, #20c858 0%, #25d366 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
	}

	/* Business Details - Combined Card */
	.business-details-container {
		margin-bottom: 2rem;
	}

	.business-info-card {
		background-color: var(--light-card-bg);
		border-radius: var(--border-radius-lg);
		padding: 2rem;
		box-shadow: var(--shadow-md);
		transition: all var(--transition-medium);
		border: 1px solid rgba(0, 0, 0, 0.08);
	}

	.dark .business-info-card {
		background-color: var(--dark-card-bg);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.business-info-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.business-info-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.info-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.section-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--primary-color);
		margin: 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--primary-light);
	}

	.dark .section-title {
		color: var(--primary-light);
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.description-text {
		margin: 0;
		line-height: 1.6;
		color: var(--text-medium);
	}

	.dark .description-text {
		color: #a0aec0;
	}

	/* Contact & Location Grid */
	.contact-location-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.contact-details,
	.location-details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.detail-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.detail-icon {
		font-size: 1.1rem;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	.detail-content {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	.detail-label {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-medium);
	}

	.dark .detail-label {
		color: #a0aec0;
	}

	.detail-value {
		color: var(--primary-color);
		text-decoration: none;
		transition: color var(--transition-fast);
		word-break: break-all;
	}

	.dark .detail-value {
		color: var(--primary-light);
	}

	.detail-value:hover {
		color: var(--primary-hover);
		text-decoration: underline;
	}

	.phone-link:hover {
		color: var(--secondary-color);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--primary-light);
	}

	.dark .card-header {
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.card-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background-color: var(--primary-light);
		border-radius: 50%;
		color: var(--primary-color);
	}

	.dark .card-icon {
		background-color: rgba(255, 255, 255, 0.1);
		color: var(--primary-light);
	}

	.card-header h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--primary-color);
	}

	.dark .card-header h3 {
		color: var(--primary-light);
	}

	/* Services Styling */
	.services-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.service-tag {
		background-color: var(--primary-light);
		color: var(--primary-color);
		padding: 0.4rem 0.8rem;
		border-radius: 20px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.dark .service-tag {
		background-color: rgba(255, 255, 255, 0.1);
		color: var(--primary-light);
	}

	/* Project cards */
	.recent-projects {
		margin: 1rem 0;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--grid-gap);
		margin-top: 1.5rem;
	}

	.project-card {
		border-radius: var(--border-radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-md);
		transition:
			transform var(--transition-medium),
			box-shadow var(--transition-medium);
		background-color: var(--light-card-bg);
		height: 100%;
	}

	.dark .project-card {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.project-card:hover {
		transform: translateY(-5px);
		box-shadow: var(--shadow-lg);
	}

	.project-image {
		height: 200px;
		overflow: hidden;
		position: relative;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--transition-slow);
	}

	.project-card:hover .project-image img {
		transform: scale(1.05);
	}

	.no-image {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		background-color: #f1f1f1;
		color: var(--text-medium);
		font-weight: 500;
	}

	.dark .no-image {
		background-color: #2a2a2a;
		color: #999;
	}

	.project-details {
		padding: 1.5rem;
	}

	.project-details h3 {
		margin-top: 0;
		margin-bottom: 0.75rem;
		font-size: 1.3rem;
		color: var(--primary-color);
		font-weight: 600;
	}

	.dark .project-details h3 {
		color: var(--primary-light);
	}

	.project-details p {
		margin: 0.5rem 0;
		font-size: 0.95rem;
		color: var(--text-medium);
	}

	.dark .project-details p {
		color: #a0aec0;
	}

	.location,
	.date {
		color: var(--text-medium);
		font-size: 0.9rem;
	}

	.dark .location,
	.dark .date {
		color: #a0aec0;
	}

	.system-size {
		color: var(--primary-color);
		font-weight: 600;
		margin: 0;
	}

	.dark .system-size {
		color: var(--primary-light);
	}

	.loading,
	.error,
	.no-projects {
		text-align: center;
		padding: 2rem;
		background-color: var(--light-card-bg);
		border-radius: var(--border-radius-md);
		margin: 1rem 0;
		color: var(--text-medium);
	}

	.dark .loading,
	.dark .error,
	.dark .no-projects {
		background-color: rgba(255, 255, 255, 0.05);
		color: #a0aec0;
	}

	/* Other businesses section */
	.other-businesses {
		margin-top: 2rem;
		text-align: center;
		padding: var(--section-padding);
		background-color: var(--light-card-bg);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
	}

	.dark .other-businesses {
		background-color: var(--dark-card-bg);
	}

	.other-businesses p {
		font-size: 1rem;
		margin-bottom: 1rem;
		color: var(--text-medium);
	}

	.dark .other-businesses p {
		color: #a0aec0;
	}

	.other-businesses button {
		background-color: transparent;
		border: 1px solid var(--primary-color);
		color: var(--primary-color);
		min-width: 180px;
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		transition: all var(--transition-fast);
	}

	.other-businesses button:hover {
		background-color: rgba(45, 130, 199, 0.05);
		transform: translateY(-2px);
	}

	.dark .other-businesses button {
		border-color: var(--primary-light);
		color: var(--primary-light);
	}

	.dark .other-businesses button:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	/* Project link styling */
	.project-link {
		display: block;
		text-decoration: none;
		color: inherit;
		transition:
			transform var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.project-link:hover {
		transform: translateY(-2px);
	}

	/* About container - width constraint without card styling */
	.about-container {
		max-width: var(--container-width);
		width: 100%;
		margin-bottom: 2rem;
	}

	/* Responsive design */
	@media (max-width: 992px) {
		main {
			padding: 1.5rem 1rem;
		}

		.hero-section {
			padding: 2.5rem 1.5rem;
		}

		.hero-section h1 {
			font-size: 2.2rem;
		}

		.business-info-card {
			padding: 1.5rem;
		}

		.contact-location-grid {
			gap: 1.5rem;
		}

		h2 {
			font-size: 1.6rem;
		}

		.projects-grid {
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		}
	}

	@media (max-width: 768px) {
		main {
			padding: 1rem 0.5rem;
		}

		.hero-section {
			padding: 2rem 1rem;
		}

		.hero-section h1 {
			font-size: 2rem;
		}

		.call-now-button-hero,
		.whatsapp-button-hero {
			width: 100%;
			max-width: 300px;
			padding: 0.9rem 1.5rem;
			font-size: 0.9rem;
		}

		.hero-actions {
			flex-direction: column;
			align-items: center;
		}

		.business-info-card {
			padding: 1.25rem;
		}

		.contact-location-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		section {
			padding: 1.5rem 1rem;
		}

		h2 {
			font-size: 1.4rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.project-details {
			padding: 1rem;
		}

		button {
			padding: 0.6rem 1.2rem;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 576px) {
		.hero-section {
			padding: 1.5rem 0.75rem;
		}

		.hero-section h1 {
			font-size: 1.8rem;
		}

		.business-tag {
			font-size: 0.8rem;
			padding: 0.4rem 0.8rem;
		}

		.call-now-button-hero,
		.whatsapp-button-hero {
			font-size: 0.8rem;
			padding: 0.8rem 1.2rem;
			width: auto;
			min-width: 140px;
		}

		.business-login-btn {
			font-size: 0.8rem;
			padding: 0.4rem 0.8rem;
		}

		.business-info-card {
			padding: 1rem;
		}

		.card-header {
			gap: 0.5rem;
		}

		.card-icon {
			width: 35px;
			height: 35px;
		}

		.card-header h3 {
			font-size: 1.1rem;
		}

		h2 {
			font-size: 1.3rem;
		}

		.project-image {
			height: 160px;
		}

		.service-tag {
			font-size: 0.8rem;
			padding: 0.3rem 0.6rem;
		}
	}
</style>
