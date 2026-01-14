<script>
	import { isDarkMode } from '$lib/in/themeStore'; // Import dark mode state

	// Use the global theme store
	let darkMode = $derived($isDarkMode);
</script>

<svelte:head>
	<title>Privacy Policy | Solar Vipani - Your Trusted Solar Panel Installation Marketplace</title>
	<meta
		name="description"
		content="Privacy policy of Solar Vipani regarding user data collection, usage, and protection."
	/>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Privacy Policy</h1>

	<p>
		At Solarvipani.com, we are committed to safeguarding your privacy and ensuring that your
		personal information is protected. This Privacy Policy outlines how we collect, use, and protect
		your data when you use our services.
	</p>

	<section>
		<h2>1. Information We Collect</h2>
		<p>
			We collect your phone number when you submit a lead form on our website. This information is
			essential for connecting you with our trusted solar installers.
		</p>
	</section>

	<section>
		<h2>2. Use of Your Information</h2>
		<p>
			Your phone number is shared with solar installers only after obtaining your explicit consent.
			This allows them to contact you regarding your solar installation needs.
		</p>
	</section>

	<section>
		<h2>3. Data Sharing and Disclosure</h2>
		<p>
			We do not share your personal data with any third parties other than the installers you have
			consented to connect with. We ensure that all parties comply with strict confidentiality
			obligations.
		</p>
	</section>

	<section>
		<h2>4. Data Retention</h2>
		<p>
			Your personal data is retained for a period of six months from the date of collection. After
			this period, all personal information is securely deleted from our systems.
		</p>
	</section>

	<section>
		<h2>5. Compliance with Indian Data Protection Regulations</h2>
		<p>
			We adhere to all applicable data protection laws and regulations in India, including the
			Information Technology Act, 2000, and the rules thereunder. We ensure that your data is
			processed lawfully and transparently.
		</p>
	</section>

	<section>
		<h2>6. Your Rights</h2>
		<p>
			You have the right to access, correct, or delete your personal information held by us. To
			exercise these rights, please contact us at <a href="mailto:admin@solarvipani.com"
				>admin@solarvipani.com</a
			>.
		</p>
		<p>
			<strong>Request Data Deletion:</strong> You can request deletion of your personal data by visiting our 
			<a href="/data-deletion">Data Deletion Request page</a>. We will process your request within 30 business days.
		</p>
	</section>

	<section>
		<h2>7. Security Measures</h2>
		<p>
			We implement appropriate technical and organizational measures to protect your data against
			unauthorized access, alteration, disclosure, or destruction.
		</p>
	</section>

	<section>
		<h2>8. Changes to This Policy</h2>
		<p>
			We may update this Privacy Policy from time to time. Any changes will be posted on this page
			with an updated revision date.
		</p>
	</section>

	<section>
		<h2>9. Contact Us</h2>
		<p>
			If you have any questions or concerns about this Privacy Policy or our data practices, please
			contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.
		</p>
	</section>
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
		padding: 2rem;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	main > * {
		max-width: 800px;
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
	h1,
	h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
		line-height: 1.3;
	}

	h1 {
		text-align: center; /* Center the main heading */
	}

	/* Paragraph styling */
	p {
		font-size: 1rem;
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	/* Section styling */
	section {
		margin-bottom: 2rem;
	}

	/* Links */
	a {
		color: var(--accent-color);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	/* Responsive styling */
	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		h1,
		h2 {
			font-size: 1.8rem;
		}

		p {
			font-size: 0.95rem;
		}
	}
</style>
