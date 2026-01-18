<script>
	import { isDarkMode } from '$lib/themeStore.svelte';

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

<main class={`flex flex-col items-center px-4 md:px-8 py-8 transition-colors duration-300 ${darkMode ? 'dark bg-background text-foreground' : 'light bg-background text-foreground'}`}>
	<div class="max-w-2xl w-full">
		<h1 class="text-3xl md:text-4xl font-semibold mb-6">Terms of Use</h1>

		<section class="mb-8">
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				Welcome to SolarVipani.com ("the Website"). By accessing or using the Website, you agree to
				comply with these Terms of Use ("Terms"). If you do not agree with these Terms, you may not
				use the Website.
			</p>
		</section>

		<section class="space-y-8">
			<div>
				<h2 class="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					By using the Website, you acknowledge that you have read, understood, and agree to be bound by
					these Terms, along with our Privacy Policy.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">2. Description of Services</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					Solar Vipani connects users seeking solar panel installation services with verified
					installers. We act as a marketplace platform and are not responsible for the services provided
					by the installers.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
				<ul class="ml-4 md:ml-6 space-y-2 text-base md:text-lg text-foreground-secondary dark:text-foreground-secondary">
					<li>
						<strong class="text-foreground dark:text-foreground">Provide Accurate Information:</strong> Users must provide truthful and accurate details
						when interacting with the Website.
					</li>
					<li>
						<strong class="text-foreground dark:text-foreground">Comply with Laws:</strong> Users must adhere to all applicable laws and regulations while
						using the Website.
					</li>
				</ul>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">4. Installer Responsibilities</h2>
				<ul class="ml-4 md:ml-6 space-y-2 text-base md:text-lg text-foreground-secondary dark:text-foreground-secondary">
					<li>
						<strong class="text-foreground dark:text-foreground">Qualifications:</strong> Installers must ensure they have all required licenses, certifications,
						and insurance to operate legally.
					</li>
					<li>
						<strong class="text-foreground dark:text-foreground">Accurate Listings:</strong> Installers must provide up-to-date and accurate information
						about their services.
					</li>
				</ul>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">5. Platform Use and Restrictions</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					Users and Installers agree to use the Website only for its intended purposes. Activities such
					as posting misleading content, conducting illegal activities, or interfering with the
					Website's functionality are strictly prohibited.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">6. Fees and Payments</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					Solar Vipani may charge fees for certain features. Fees will be disclosed upfront. Note that
					Solar Vipani does not handle transactions between users and installers.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">7. Dispute Resolution</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					Solar Vipani is not responsible for disputes between users and installers. While we may offer
					optional mediation services, the responsibility for resolving disputes lies with the parties
					involved.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">8. Intellectual Property</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					All content, logos, and trademarks on the Website are owned by Solar Vipani or its licensors.
					Unauthorized reproduction or use is prohibited.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">9. Limitation of Liability</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					Solar Vipani is not liable for damages arising from the use of the Website, including service
					quality issues or content posted on the platform.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">10. Privacy Policy</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					Your use of the Website is governed by our <a
						href="/privacy-policy"
						aria-label="Privacy Policy"
						class="text-primary dark:text-primary underline hover:no-underline">Privacy Policy</a
					>.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">11. Changes to Terms</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					We reserve the right to modify these Terms at any time. Updates will be posted on this page,
					and continued use of the Website implies acceptance of the revised Terms.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">12. Termination</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
					We reserve the right to terminate or suspend your access to the Website for any reason,
					including violations of these Terms.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">13. Governing Law</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">These Terms are governed by the laws of Republic of India.</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-3">14. Contact Us</h2>
				<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary mb-3">For questions or concerns about these Terms, please contact us:</p>
				<ul class="ml-4 md:ml-6 space-y-2 text-base md:text-lg text-foreground-secondary dark:text-foreground-secondary">
					<li>Email: <a href="mailto:admin@solarvipani.com" class="text-primary dark:text-primary underline hover:no-underline">admin@solarvipani.com</a></li>
					<li>Phone: <a href="tel:+918983066701" class="text-primary dark:text-primary underline hover:no-underline">+91 8983066701</a></li>
				</ul>
			</div>
		</section>
	</div>
</main>
