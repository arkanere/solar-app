<script>
	import { isDarkMode } from '$lib/themeStore';

	// Initialize dark mode state
	let darkMode = $derived($isDarkMode);
</script>

<svelte:head>
	<title>Terms of Use | Solar Vipani - Your Trusted Solar Panel Installation Marketplace</title>
	<meta
		name="description"
		content="Read the Terms of Use for Solar Vipani, detailing user responsibilities, platform rules, and service limitations for a trusted and secure solar marketplace experience."
	/>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Terms of Use</h1>

	<section class="introduction">
		<p>
			Welcome to SolarVipani.com ("the Website"). By accessing or using the Website, you agree to
			comply with these Terms of Use ("Terms"). If you do not agree with these Terms, you may not
			use the Website.
		</p>
	</section>

	<section class="terms">
		<h2>1. Acceptance of Terms</h2>
		<p>
			By using the Website, you acknowledge that you have read, understood, and agree to be bound by
			these Terms, along with our Privacy Policy.
		</p>

		<h2>2. Description of Services</h2>
		<p>
			Solar Vipani connects users seeking solar panel installation services with verified
			installers. We act as a marketplace platform and are not responsible for the services provided
			by the installers.
		</p>

		<h2>3. User Responsibilities</h2>
		<ul>
			<li>
				<strong>Provide Accurate Information:</strong> Users must provide truthful and accurate details
				when interacting with the Website.
			</li>
			<li>
				<strong>Comply with Laws:</strong> Users must adhere to all applicable laws and regulations while
				using the Website.
			</li>
		</ul>

		<h2>4. Installer Responsibilities</h2>
		<ul>
			<li>
				<strong>Qualifications:</strong> Installers must ensure they have all required licenses, certifications,
				and insurance to operate legally.
			</li>
			<li>
				<strong>Accurate Listings:</strong> Installers must provide up-to-date and accurate information
				about their services.
			</li>
		</ul>

		<h2>5. Platform Use and Restrictions</h2>
		<p>
			Users and Installers agree to use the Website only for its intended purposes. Activities such
			as posting misleading content, conducting illegal activities, or interfering with the
			Website's functionality are strictly prohibited.
		</p>

		<h2>6. Fees and Payments</h2>
		<p>
			Solar Vipani may charge fees for certain features. Fees will be disclosed upfront. Note that
			Solar Vipani does not handle transactions between users and installers.
		</p>

		<h2>7. Dispute Resolution</h2>
		<p>
			Solar Vipani is not responsible for disputes between users and installers. While we may offer
			optional mediation services, the responsibility for resolving disputes lies with the parties
			involved.
		</p>

		<h2>8. Intellectual Property</h2>
		<p>
			All content, logos, and trademarks on the Website are owned by Solar Vipani or its licensors.
			Unauthorized reproduction or use is prohibited.
		</p>

		<h2>9. Limitation of Liability</h2>
		<p>
			Solar Vipani is not liable for damages arising from the use of the Website, including service
			quality issues or content posted on the platform.
		</p>

		<h2>10. Privacy Policy</h2>
		<p>
			Your use of the Website is governed by our <a
				href="/privacy-policy"
				aria-label="Privacy Policy">Privacy Policy</a
			>.
		</p>

		<h2>11. Changes to Terms</h2>
		<p>
			We reserve the right to modify these Terms at any time. Updates will be posted on this page,
			and continued use of the Website implies acceptance of the revised Terms.
		</p>

		<h2>12. Termination</h2>
		<p>
			We reserve the right to terminate or suspend your access to the Website for any reason,
			including violations of these Terms.
		</p>

		<h2>13. Governing Law</h2>
		<p>These Terms are governed by the laws of Republic of India.</p>

		<h2>14. Contact Us</h2>
		<p>For questions or concerns about these Terms, please contact us:</p>
		<ul>
			<li>Email: <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a></li>
			<li>Phone: <a href="tel:+918983066701">+91 8983066701</a></li>
		</ul>
	</section>
</main>

<style>
	/* Reusing the same styles as the About Us page for consistency */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

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
		max-width: 600px;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	h1,
	h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	p {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	ul {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	li {
		margin-bottom: 1rem;
	}

	a {
		color: var(--accent-color);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
