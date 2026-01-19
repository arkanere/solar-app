<script>
	import QueryForm from '$lib/in-new-rewrites/QueryForm.svelte';
</script>

<main class="flex flex-col items-center justify-center px-4 md:px-8 py-8 transition-colors duration-300 min-h-screen bg-background text-foreground">
	<div class="max-w-2xl w-full">
		<h1 class="text-3xl md:text-4xl font-semibold mb-6 leading-snug text-center">Power Up Your Solar Project—No More Searching, Just Solutions!</h1>

		<p class="text-base md:text-lg mb-6 leading-relaxed">
			Tired of endless searching to find the right solar solution? We get it—sourcing reliable,
			large-scale solar providers for <strong>medium to large projects (50 kW and above)</strong> can
			be overwhelming. That's why we've streamlined the process, connecting you directly with top-tier
			experts from our <strong>network of 5,000+ installers across 5,000+ cities and towns</strong> nationwide.
		</p>

		<h2 class="text-2xl md:text-3xl font-semibold mb-6 leading-snug">This is a Premium Access service (₹1000 flat fee), Here's What You Gain:</h2>
		<ul class="ml-4 md:ml-6 mb-6 text-base md:text-lg space-y-4">
			<li class="leading-relaxed">
				<strong>Skip the Search:</strong> Forget sifting through endless providers. Submit your requirements,
				and qualified experts will reach out with competitive proposals.
			</li>
			<li class="leading-relaxed">
				<strong>Tailored Solutions</strong> Receive customized proposals from verified solar providers
				who specialize in large-scale installations, tailored to your unique needs.
			</li>
			<li class="leading-relaxed">
				<strong>Complete Control:</strong> Review, compare, and select from competitive proposals — only
				the best make the cut.
			</li>
		</ul>

		<p class="text-base md:text-lg mb-6 leading-relaxed">
			Whether you're a business, educational institution, corporate office, or housing complex, our
			expansive network ensures you'll find the right fit. With a focus on large-scale needs, we make
			sure your project receives the dedicated expertise it deserves.
		</p>

		<p class="text-base md:text-lg mb-8 leading-relaxed">
			<strong>Ready to Go Solar?</strong> Submit your requirements today, and our experts will call to
			get your project moving—quickly, smoothly, and professionally.
		</p>

		<!-- Form inside a box container -->
		<div class="w-full p-6 md:p-8 rounded-lg shadow-md dark:shadow-card bg-card  mb-8 transition-colors duration-300">
			<h2 class="text-2xl md:text-3xl font-semibold mb-6 text-center">Share Your Details Below:</h2>
			<QueryForm />
		</div>

		<div class="text-left">
			<p class="text-base md:text-lg mb-2">
				Please contact us at
				<a href="mailto:admin@solarvipani.com" class="text-primary dark:text-primary underline hover:no-underline">admin@solarvipani.com</a>
			</p>
			<p class="text-base md:text-lg mb-6">
				or call us at <a href="tel:+918983066701" class="text-primary dark:text-primary underline hover:no-underline">+91 8983066701</a>
			</p>

			<h4 class="text-lg font-semibold mb-4">Follow us on:</h4>
			<div class="flex flex-col md:flex-row gap-4 md:gap-6">
				<a
					href="https://www.facebook.com/p/Solar-Vipani-61556033262509/"
					target="_blank"
					aria-label="Facebook"
					class="text-primary dark:text-primary font-semibold text-lg hover:underline">Facebook</a
				>
				<a href="https://x.com/Solarvipani" target="_blank" aria-label="Twitter" class="text-primary dark:text-primary font-semibold text-lg hover:underline">Twitter</a>
				<a href="https://www.linkedin.com/company/solar-vipani/" target="_blank" aria-label="LinkedIn" class="text-primary dark:text-primary font-semibold text-lg hover:underline">LinkedIn</a>
				<a href="https://www.instagram.com/solar.vipani/" target="_blank" aria-label="Instagram" class="text-primary dark:text-primary font-semibold text-lg hover:underline">Instagram</a>
				<a href="https://wa.me/918983066701" target="_blank" aria-label="Whatsapp" class="text-primary dark:text-primary font-semibold text-lg hover:underline">Whatsapp</a>
			</div>
		</div>
	</div>
</main>
