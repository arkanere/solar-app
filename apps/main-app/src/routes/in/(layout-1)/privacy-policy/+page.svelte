<script>
	import { isDarkMode } from '$lib/themeStore'; // Import dark mode state

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

<main class={`flex flex-col items-center px-4 md:px-8 py-8 transition-colors duration-300 ${darkMode ? 'dark bg-background text-foreground' : 'light bg-background text-foreground'}`}>
	<div class="max-w-3xl w-full">
		<h1 class="text-3xl md:text-4xl font-semibold mb-6 text-center">Privacy Policy</h1>

		<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary mb-8">
			At Solarvipani.com, we are committed to safeguarding your privacy and ensuring that your
			personal information is protected. This Privacy Policy outlines how we collect, use, and protect
			your data when you use our services.
		</p>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">1. Information We Collect</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				We collect your phone number when you submit a lead form on our website. This information is
				essential for connecting you with our trusted solar installers.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">2. Use of Your Information</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				Your phone number is shared with solar installers only after obtaining your explicit consent.
				This allows them to contact you regarding your solar installation needs.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">3. Data Sharing and Disclosure</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				We do not share your personal data with any third parties other than the installers you have
				consented to connect with. We ensure that all parties comply with strict confidentiality
				obligations.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">4. Data Retention</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				Your personal data is retained for a period of six months from the date of collection. After
				this period, all personal information is securely deleted from our systems.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">5. Compliance with Indian Data Protection Regulations</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				We adhere to all applicable data protection laws and regulations in India, including the
				Information Technology Act, 2000, and the rules thereunder. We ensure that your data is
				processed lawfully and transparently.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">6. Your Rights</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary mb-3">
				You have the right to access, correct, or delete your personal information held by us. To
				exercise these rights, please contact us at <a href="mailto:admin@solarvipani.com" class="text-primary dark:text-primary underline hover:no-underline"
					>admin@solarvipani.com</a
				>.
			</p>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				<strong class="text-foreground dark:text-foreground">Request Data Deletion:</strong> You can request deletion of your personal data by visiting our
				<a href="/data-deletion" class="text-primary dark:text-primary underline hover:no-underline">Data Deletion Request page</a>. We will process your request within 30 business days.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">7. Security Measures</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				We implement appropriate technical and organizational measures to protect your data against
				unauthorized access, alteration, disclosure, or destruction.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">8. Changes to This Policy</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				We may update this Privacy Policy from time to time. Any changes will be posted on this page
				with an updated revision date.
			</p>
		</section>

		<section>
			<h2 class="text-2xl font-semibold mb-3">9. Contact Us</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary dark:text-foreground-secondary">
				If you have any questions or concerns about this Privacy Policy or our data practices, please
				contact us at <a href="mailto:admin@solarvipani.com" class="text-primary dark:text-primary underline hover:no-underline">admin@solarvipani.com</a>.
			</p>
		</section>
	</div>
</main>
