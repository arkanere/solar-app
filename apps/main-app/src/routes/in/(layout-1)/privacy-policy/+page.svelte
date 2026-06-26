<script>
	const lastUpdated = 'June 2026';
</script>

<svelte:head>
	<title>Privacy Policy | Solar Vipani - Your Trusted Solar Panel Installation Marketplace</title>
	<meta
		name="description"
		content="Privacy policy of Solar Vipani regarding user data collection, usage, and protection under India's Digital Personal Data Protection Act, 2023."
	/>
</svelte:head>

<main class="flex flex-col items-center px-[theme(--container-padding)] md:px-[theme(--container-padding)] py-8 transition-colors duration-300 bg-background text-foreground">
	<div class="max-w-3xl w-full">
		<h1 class="text-3xl md:text-4xl font-semibold mb-2 text-center">Privacy Policy</h1>
		<p class="text-sm text-foreground-secondary text-center mb-6">Last updated: {lastUpdated}</p>

		<p class="text-base md:text-lg leading-relaxed text-foreground-secondary mb-8">
			At Solarvipani.com ("Solar Vipani", "we", "us"), we are committed to safeguarding your privacy
			and protecting your personal data. This Privacy Policy explains how we collect, use, share, and
			protect your personal data when you use our services, and describes your rights under India's
			<strong class="text-foreground">Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>
			and the Information Technology Act, 2000. For the purposes of the DPDP Act, Solar Vipani acts as
			a <strong class="text-foreground">Data Fiduciary</strong> in respect of the personal data you provide.
		</p>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">1. Information We Collect</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary mb-3">
				When you submit an inquiry (a "lead") or otherwise use our services, we may collect:
			</p>
			<ul class="list-disc pl-6 space-y-1 text-base md:text-lg leading-relaxed text-foreground-secondary">
				<li>Your name, phone number and email address</li>
				<li>Your PIN code, district and state (to match you with installers near you)</li>
				<li>Details of your solar inquiry and any comments you provide</li>
				<li>Your electricity bill, if you choose to upload one, so installers can prepare an accurate quote</li>
				<li>Limited technical and usage data (e.g. pages visited) where you have consented to analytics cookies</li>
				<li>Messages you send to our chatbot</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				We use your personal data to connect you with solar installers in your area, to enable those
				installers to respond to your inquiry, to operate and improve our website, to communicate with
				you about your inquiry, and to comply with our legal obligations. We process your data only for
				these specified, lawful purposes.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">3. Consent and Legal Basis</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				We process your personal data on the basis of the consent you give when you submit a lead form
				and tick the consent checkbox, in accordance with Section 6 of the DPDP Act. Your consent is
				free, specific, informed, and unambiguous. You may withdraw your consent at any time by
				contacting our Grievance Officer (Section 9) or by using our
				<a href="/in/data-deletion" class="text-primary underline hover:no-underline">Data Deletion Request</a>
				page; withdrawal does not affect processing carried out before withdrawal.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">4. Data Sharing and Disclosure</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary mb-3">
				When you consent, we share your contact details with one or more solar installers in your area
				so that they can follow up on your inquiry. These installers are
				<strong class="text-foreground">independent Data Fiduciaries (controllers) in their own right</strong>,
				not our processors. This means that once your details are transferred to an installer, the
				installer is independently responsible for how it handles your data under applicable law.
				Installers accept binding data-handling obligations — including using your details solely to
				respond to your inquiry, not selling or onward-transferring them, and deleting them on request —
				before they are permitted to receive any lead.
			</p>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				We do not sell your personal data, and we do not share it with any third party other than the
				installers you have consented to connect with and the service providers listed in Section 5.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">5. Service Providers (Sub-processors)</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary mb-3">
				We use a small number of trusted service providers to operate our platform. They process
				personal data only on our instructions and under data protection agreements:
			</p>
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm md:text-base border-collapse">
					<thead>
						<tr class="border-b border-foreground/20 text-foreground">
							<th class="py-2 pr-4 font-semibold">Provider</th>
							<th class="py-2 pr-4 font-semibold">Purpose</th>
							<th class="py-2 font-semibold">Data Handled</th>
						</tr>
					</thead>
					<tbody class="text-foreground-secondary">
						<tr class="border-b border-foreground/10">
							<td class="py-2 pr-4">Brevo</td>
							<td class="py-2 pr-4">Transactional &amp; notification email</td>
							<td class="py-2">Name, email</td>
						</tr>
						<tr class="border-b border-foreground/10">
							<td class="py-2 pr-4">Twilio</td>
							<td class="py-2 pr-4">SMS / WhatsApp notifications</td>
							<td class="py-2">Phone number</td>
						</tr>
						<tr class="border-b border-foreground/10">
							<td class="py-2 pr-4">Cloudinary</td>
							<td class="py-2 pr-4">Secure storage of uploaded electricity bills</td>
							<td class="py-2">Electricity bill files</td>
						</tr>
						<tr class="border-b border-foreground/10">
							<td class="py-2 pr-4">PostHog</td>
							<td class="py-2 pr-4">Website analytics (only with your consent)</td>
							<td class="py-2">Usage / device data</td>
						</tr>
						<tr class="border-b border-foreground/10">
							<td class="py-2 pr-4">OpenAI</td>
							<td class="py-2 pr-4">Powers our support chatbot</td>
							<td class="py-2">Chatbot messages</td>
						</tr>
						<tr class="border-b border-foreground/10">
							<td class="py-2 pr-4">Vercel</td>
							<td class="py-2 pr-4">Website hosting &amp; infrastructure</td>
							<td class="py-2">All data in transit</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">6. Data Retention</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				We retain unclaimed lead data for a maximum of six months from the date of collection, after
				which it is automatically and securely deleted from our systems along with any uploaded
				electricity bill. Where a lead has been claimed by an installer, the installer becomes
				responsible for retention of the copy it holds as an independent Data Fiduciary.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">7. Your Rights as a Data Principal</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary mb-3">
				Under the DPDP Act, 2023 you have the following rights in respect of your personal data:
			</p>
			<ul class="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-foreground-secondary">
				<li>
					<strong class="text-foreground">Right to access:</strong> obtain a summary of the personal data
					we hold about you and who it has been shared with, via our
					<a href="/in/data-access" class="text-primary underline hover:no-underline">Request My Data</a>
					page. We will respond within 30 days.
				</li>
				<li>
					<strong class="text-foreground">Right to correction:</strong> request correction of inaccurate
					or incomplete data by contacting our Grievance Officer.
				</li>
				<li>
					<strong class="text-foreground">Right to erasure:</strong> request deletion of your personal
					data via our
					<a href="/in/data-deletion" class="text-primary underline hover:no-underline">Data Deletion Request</a>
					page. We will process your request within 30 days.
				</li>
				<li>
					<strong class="text-foreground">Right to data portability:</strong> request a copy of the data
					you provided in a structured, commonly used format. On request, our team will send you a CSV
					export of your data.
				</li>
				<li>
					<strong class="text-foreground">Right to grievance redressal:</strong> raise any concern with
					our Grievance Officer (Section 9).
				</li>
				<li>
					<strong class="text-foreground">Right to nominate:</strong> nominate another individual to
					exercise your rights in the event of your death or incapacity.
				</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">8. Cookies and Analytics</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				We do not load any analytics or tracking cookies until you give consent through the cookie
				banner shown on your first visit. If you decline, no analytics scripts are loaded. You can
				change your choice at any time by clearing your browser storage for this site.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">9. Grievance Officer</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				In accordance with the DPDP Act, 2023 and the Information Technology Act, 2000, you may contact
				our Grievance Officer with any question, concern, or complaint regarding your personal data:
			</p>
			<div class="mt-3 p-4 rounded-lg border border-foreground/15 text-base md:text-lg leading-relaxed text-foreground-secondary">
				<p><strong class="text-foreground">Grievance Officer</strong>, Solar Vipani</p>
				<p>
					Email: <a href="mailto:admin@solarvipani.com" class="text-primary underline hover:no-underline">admin@solarvipani.com</a>
				</p>
				<p>We acknowledge complaints promptly and resolve them within 30 days.</p>
			</div>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">10. AI Chatbot</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				Messages you send to our support chatbot are processed by OpenAI solely to generate a response
				to you. These messages are <strong class="text-foreground">not used to train AI models</strong>.
				Please avoid sharing sensitive personal information in the chatbot.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">11. Compliance and Data Fiduciary Obligations</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				As a Data Fiduciary, we process personal data lawfully and transparently, collect only what is
				necessary for the stated purposes, keep it accurate, retain it only as long as needed, secure
				it with appropriate technical and organisational measures, and act on the rights you exercise.
				We comply with the Digital Personal Data Protection Act, 2023, the Information Technology Act,
				2000, and the rules made thereunder.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">12. Security Measures</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				We implement appropriate technical and organizational measures to protect your data against
				unauthorized access, alteration, disclosure, or destruction, including encryption of data in
				transit, access controls, and authenticated, time-limited access to uploaded files.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">13. Children's Data</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				Our services are intended for adults. We do not knowingly collect personal data of children
				without verifiable parental or guardian consent as required by the DPDP Act, 2023.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-3">14. Changes to This Policy</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				We may update this Privacy Policy from time to time. Any changes will be posted on this page
				with an updated revision date shown at the top.
			</p>
		</section>

		<section>
			<h2 class="text-2xl font-semibold mb-3">15. Contact Us</h2>
			<p class="text-base md:text-lg leading-relaxed text-foreground-secondary">
				If you have any questions or concerns about this Privacy Policy or our data practices, please
				contact us at <a href="mailto:admin@solarvipani.com" class="text-primary underline hover:no-underline">admin@solarvipani.com</a>.
			</p>
		</section>
	</div>
</main>
