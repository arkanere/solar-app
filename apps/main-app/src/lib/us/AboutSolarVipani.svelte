<script>
	import { isDarkMode } from '$lib/us/themeStore';

	// Reactive statement for dark mode
	let darkMode = $derived($isDarkMode);

	const socialLinks = [
		{
			label: 'Facebook',
			url: 'https://www.facebook.com/p/Solar-Vipani-61556033262509/',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>'
		},
		{
			label: 'Twitter',
			url: 'https://x.com/Solarvipani',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>'
		},
		{
			label: 'LinkedIn',
			url: 'https://www.linkedin.com/company/solar-vipani/',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
		},
		{
			label: 'Instagram',
			url: 'https://www.instagram.com/solar.vipani/',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
		},
		{
			label: 'WhatsApp',
			url: 'https://wa.me/918983066701',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>'
		}
	];
</script>

<section class="about-section" class:dark={darkMode}>
	<div class="section-header">
		<h2>About Solarvipani</h2>
		<div class="section-divider">
			<span class="divider-accent"></span>
		</div>
	</div>

	<div class="about-container">
		<img
			src="/logo.webp"
			alt="Solarvipani Logo"
			class="about-logo"
			width="200"
			height="100"
			loading="lazy"
		/>

		<div class="about-text">
			<p>
				We are your premier marketplace aggregator dedicated to connecting residential and business
				customers with <strong>Best Local Solar Panel Installation</strong> companies, ensuring that you make smart decisions backed by credible information and have a
				hassle-free experience.
			</p>
			<p>
				Our platform is designed for smart homeowners and businesses ready to go solar but unsure
				where to start.
			</p>
		</div>
	</div>

	<!-- Social Media Links -->
	<div class="social-media">
		<h4>Follow us on:</h4>
		<div class="social-links">
			{#each socialLinks as link}
				<a href={link.url} target="_blank" aria-label={link.label} class="social-link">
					{@html link.icon}
					<span>{link.label}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	/* Root variables using custom properties */
	:root {
		/* Colors */
		--primary-color: #0056b3;
		--primary-hover: #004494;
		--primary-light: #e6f0ff;

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

		/* Typography */
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
		--body-line-height: 1.6;

		/* Layout */
		--section-padding: 4rem 1.5rem;

		/* Transitions */
		--transition-fast: 0.2s ease;
		--transition-medium: 0.3s ease;
	}

	/* Section styling */
	.about-section {
		padding: var(--section-padding);
		margin-bottom: 2rem;
		border-radius: var(--border-radius-lg);
		background-color: var(--light-card-bg);
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-medium);
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: var(--font-family);
		line-height: var(--body-line-height);
		color: var(--text-dark);
	}

	.about-section.dark {
		background-color: var(--dark-card-bg);
		color: var(--text-light);
	}

	.section-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.section-header h2 {
		font-size: 2.2rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--primary-color);
	}

	.dark .section-header h2 {
		color: var(--primary-light);
	}

	.section-divider {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1rem auto;
	}

	.divider-accent {
		width: 80px;
		height: 4px;
		background: #ffc107;
		border-radius: 2px;
	}

	/* About container */
	.about-container {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.about-logo {
		width: 200px;
		height: auto;
		border-radius: var(--border-radius-md);
		box-shadow: var(--shadow-sm);
	}

	.about-text {
		flex: 1;
		font-size: 1.1rem;
		line-height: 1.7;
	}

	.about-text p {
		color: var(--text-medium);
	}

	.dark .about-text p {
		color: #cbd5e0;
	}

	.about-text strong {
		color: var(--primary-color);
		font-weight: 600;
	}

	.dark .about-text strong {
		color: #90caf9;
	}

	/* Social Media Links */
	.social-media {
		width: 100%;
		margin-top: 2rem;
	}

	.social-media h4 {
		font-size: 1.2rem;
		margin-bottom: 1rem;
		text-align: center;
		color: var(--text-dark);
	}

	.dark .social-media h4 {
		color: #e2e8f0;
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.social-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
		transition:
			color var(--transition-fast),
			transform var(--transition-fast);
	}

	.social-link:hover {
		color: var(--primary-hover);
		transform: translateY(-3px);
	}

	.dark .social-link {
		color: #90caf9;
	}

	.dark .social-link:hover {
		color: #64b5f6;
	}

	/* Responsive Styling */
	@media (max-width: 992px) {
		.section-header h2 {
			font-size: 2rem;
		}

		.about-container {
			flex-direction: column;
			text-align: center;
		}
	}

	@media (max-width: 768px) {
		.about-section {
			padding: 3rem 1rem;
		}

		.section-header h2 {
			font-size: 1.8rem;
		}
	}

	@media (max-width: 576px) {
		.about-section {
			padding: 2rem 0.5rem;
		}

		.section-header h2 {
			font-size: 1.5rem;
		}

		.social-links {
			flex-direction: column;
			align-items: center;
		}

		.about-text p {
			padding: 0 0.25rem;
		}
	}
</style>
