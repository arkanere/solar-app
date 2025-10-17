<script>
	import QueryForm from '$lib/QueryForm.svelte';
	import { isDarkMode } from '$lib/themeStore'; // Import from store if globally managed
	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Power Up Your Solar Project—No More Searching, Just Solutions!</h1>

	<p>
		Tired of endless searching to find the right solar solution? We get it—sourcing reliable,
		large-scale solar providers for <strong>medium to large projects (50 kW and above)</strong> can
		be overwhelming. That’s why we’ve streamlined the process, connecting you directly with top-tier
		experts from our <strong>network of 5,000+ installers across 5,000+ cities and towns</strong> nationwide.
	</p>

	<h2>This is a Premium Access service (₹1000 flat fee), Here’s What You Gain:</h2>
	<ul>
		<li>
			<strong>Skip the Search:</strong> Forget sifting through endless providers. Submit your requirements,
			and qualified experts will reach out with competitive proposals.
		</li>
		<li>
			<strong>Tailored Solutions</strong> Receive customized proposals from verified solar providers
			who specialize in large-scale installations, tailored to your unique needs.
		</li>
		<li>
			<strong>Complete Control:</strong> Review, compare, and select from competitive proposals — only
			the best make the cut.
		</li>
	</ul>

	<p>
		Whether you're a business, educational institution, corporate office, or housing complex, our
		expansive network ensures you’ll find the right fit. With a focus on large-scale needs, we make
		sure your project receives the dedicated expertise it deserves.
	</p>

	<p>
		<strong>Ready to Go Solar?</strong> Submit your requirements today, and our experts will call to
		get your project moving—quickly, smoothly, and professionally.
	</p>

	<!-- Form inside a box container -->
	<div class="form-container">
		<h2>Share Your Details Below:</h2>
		<QueryForm />
	</div>
	<div class="social-media">
		Please contact us at
		<a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>
		<br />
		or call us at <a href="tel:+918983066701">+91 8983066701</a>
		<p></p>

		<h4>Follow us on:</h4>
		<a
			href="https://www.facebook.com/p/Solar-Vipani-61556033262509/"
			target="_blank"
			aria-label="Facebook">Facebook</a
		>
		<a href="https://x.com/Solarvipani" target="_blank" aria-label="Twitter">Twitter</a>
		<a href="https://www.linkedin.com/company/solar-vipani/" target="_blank" aria-label="LinkedIn"
			>LinkedIn</a
		>
		<a href="https://www.instagram.com/solar.vipani/" target="_blank" aria-label="Instagram"
			>Instagram</a
		>
		<a href="https://wa.me/918983066701" target="_blank" aria-label="Whatsapp">Whatsapp</a>
	</div>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa; /* Soft light background */
		--dark-bg-color: #1a1a1a; /* Dark background */
		--light-primary-text-color: #333; /* Dark text for light mode */
		--dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
		--accent-color: #ffc107; /* Accent color similar to aeon.co */
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--light-form-bg: white; /* Form background in light mode */
		--dark-form-bg: #333; /* Form background in dark mode */
		--box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow */
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	main > * {
		max-width: 600px;
	}

	/* Light mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Heading styling */
	h1 {
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
	}

	h1 {
		text-align: center; /* Center the main heading */
	}
	h2 {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.light h1,
	.light p,
	.light li {
		color: var(--light-primary-text-color);
	}

	.dark h1,
	.dark p,
	.dark li {
		color: var(--dark-primary-text-color);
	}

	/* Paragraph styling */
	p {
		font-size: 1.1rem;
		margin-bottom: 1.8rem;
		line-height: 1.6;
	}

	/* List styling */
	ul {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	ul li {
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	strong {
		font-weight: 600;
	}

	/* Form container styling */
	.form-container {
		width: 100%;
		max-width: 600px;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: var(--box-shadow);
		transition: background-color 0.3s ease;
	}

	.form-container h2 {
		text-align: center;
	}

	/* Light mode form container */
	.light .form-container {
		background-color: var(--light-form-bg);
	}

	/* Dark mode form container */
	.dark .form-container {
		background-color: var(--dark-form-bg);
	}

	/* Responsive styling */
	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		h1,
		h2 {
			font-size: 2rem;
		}

		p,
		ul li {
			font-size: 1rem;
		}
	}
	/* Social media section styling */
	.social-media {
		margin-top: 1.5rem;
		text-align: left;
	}

	.social-media a {
		display: inline-block;
		margin-right: 1rem;
		color: var(--accent-color);
		font-weight: bold;
		text-decoration: none;
		font-size: 1.2rem;
	}

	.social-media a:hover {
		text-decoration: underline;
	}

	/* Dark mode for social media links */
	.dark .social-media a {
		color: var(--dark-primary-text-color);
	}

	a {
		color: #0066cc;
	}

	/* Responsive styling for mobile */
	@media (max-width: 768px) {
		.social-media a {
			display: block;
			margin-bottom: 0.5rem;
		}
	}
</style>
