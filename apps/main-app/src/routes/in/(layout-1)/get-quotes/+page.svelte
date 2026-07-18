<script lang="ts">
	import LeadFormSection from '$lib/in/components/LeadFormSection.svelte';
	import { breadcrumbLD } from '$lib/seo';
	import { Users, FolderCheck } from '@lucide/svelte';

	let { data } = $props();

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: 'Get Quotes', url: 'https://solarvipani.com/in/get-quotes/' }
	]);

	const faqs = [
		{
			q: 'Where can I get a solar quotation online in India?',
			a: 'You can get a free solar quotation online at Solar Vipani. Fill the inquiry form on this page with your location and energy requirements, and you will receive competitive quotations from 2-3 verified solar installers near you — entirely online, with no obligation.'
		},
		{
			q: 'Is the online solar quotation free?',
			a: 'Yes. Requesting a solar quotation online through Solar Vipani is completely free. You only deal with verified installers, compare their quotations, and decide if you want to proceed — there is no charge for the quotes.'
		},
		{
			q: 'How long does it take to receive my solar quotation?',
			a: 'After you submit the form online, you typically receive 2-3 competitive quotations from verified installers within 24 hours.'
		}
	];

	const faqLD = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
</script>

<svelte:head>
	<title>Get a Free Solar Quotation Online | Solar Vipani</title>
	<meta name="description" content="Get a free solar quotation online from verified solar panel installers in India. Compare 2-3 competitive quotations on price, services & reviews. {data.installerCount}+ installers, {data.projectCount}+ completed projects." />
	<link rel="canonical" href="https://solarvipani.com/in/get-quotes/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqLD)}<\u002Fscript>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
			<li class="text-foreground font-medium">Get Quotes</li>
		</ol>
	</nav>

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
		Get a Free Solar Quotation Online
	</h1>

	<p class="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
		Connect with verified solar installers in your area and get a solar quotation online. Share your details and receive 2-3 competitive quotations within 24 hours.
	</p>

	<!-- Trust Bar -->
	<div class="flex flex-wrap justify-center gap-6 mb-10">
		<div class="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
			<Users class="w-5 h-5 text-primary" />
			<span class="font-semibold">{data.installerCount}+</span>
			<span class="text-muted-foreground">Verified Installers</span>
		</div>
		<div class="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
			<FolderCheck class="w-5 h-5 text-primary" />
			<span class="font-semibold">{data.projectCount}+</span>
			<span class="text-muted-foreground">Verified Projects</span>
		</div>
	</div>

	<!-- Lead Form -->
	<LeadFormSection title="Get Your Solar Quotation Online" hasBusinesses={true} />

	<!-- How to get a solar quotation online -->
	<section class="mt-12">
		<h2 class="text-2xl md:text-3xl font-semibold text-primary mb-6 text-center">
			How to Get Your Solar Quotation Online
		</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="border border-border rounded-lg p-6 text-center">
				<div class="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto mb-3">1</div>
				<h3 class="font-semibold text-primary mb-2">Fill the Form Online</h3>
				<p class="text-sm text-muted-foreground">Share your location and energy requirements in the form above — it takes less than a minute.</p>
			</div>
			<div class="border border-border rounded-lg p-6 text-center">
				<div class="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto mb-3">2</div>
				<h3 class="font-semibold text-primary mb-2">Receive 2-3 Quotations</h3>
				<p class="text-sm text-muted-foreground">Verified installers near you send competitive solar quotations, usually within 24 hours.</p>
			</div>
			<div class="border border-border rounded-lg p-6 text-center">
				<div class="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto mb-3">3</div>
				<h3 class="font-semibold text-primary mb-2">Compare & Choose</h3>
				<p class="text-sm text-muted-foreground">Compare prices, equipment, and reviews online, then pick the installer that suits you best.</p>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="mt-12">
		<h2 class="text-2xl md:text-3xl font-semibold text-primary mb-6 text-center">
			Frequently Asked Questions
		</h2>
		<div class="max-w-2xl mx-auto divide-y divide-border">
			{#each faqs as faq}
				<details class="group py-4 cursor-pointer">
					<summary class="flex items-center justify-between gap-4 list-none font-semibold text-foreground select-none">
						<span>{faq.q}</span>
						<span class="shrink-0 text-primary transition-transform duration-200 group-open:rotate-45">+</span>
					</summary>
					<p class="mt-3 text-muted-foreground leading-relaxed">{faq.a}</p>
				</details>
			{/each}
		</div>
	</section>
</div>
