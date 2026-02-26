<svelte:head>
	<title>Solar Vipani for Business — Grow Your Solar Installation Business</title>
	<meta name="description" content="Get discovered by customers researching solar installation online. List your solar business for free on Solar Vipani." />
</svelte:head>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const benefits = [
		{
			icon: '🔍',
			title: 'Get Discovered Online',
			desc: 'Appear in search results when homeowners look for solar installers in your area.'
		},
		{
			icon: '📩',
			title: 'Direct Customer Inquiries',
			desc: 'Receive leads straight from customers who are ready to go solar.'
		},
		{
			icon: '🏗️',
			title: 'Post Recent Projects',
			desc: 'Showcase completed installations to build trust with prospective customers.'
		},
		{
			icon: '🌐',
			title: 'Enhance Online Presence',
			desc: 'Get a dedicated business profile page that ranks in search engines.'
		},
		{
			icon: '✅',
			title: 'Strengthen Credibility',
			desc: 'Earn a verified badge to stand out from unverified competitors.'
		},
		{
			icon: '📍',
			title: 'Manage Multiple Branches',
			desc: 'List all your branch offices under one account for wider coverage.'
		}
	];

	const steps = [
		{ num: '1', title: 'Claim Your Listing', desc: 'Register and fill in your business details — takes under 5 minutes.' },
		{ num: '2', title: 'Receive Leads', desc: 'Customers in your area find you and send inquiries directly.' },
		{ num: '3', title: 'Convert with Proposals', desc: 'Respond with proposals and close more deals.' }
	];

	const faqs = [
		{
			q: 'What is Solar Vipani?',
			a: 'Solar Vipani is India\'s growing directory of solar installation businesses. Homeowners use it to research and connect with installers in their city or town.'
		},
		{
			q: 'How much does it cost?',
			a: 'Listing your business is completely free. You can claim your profile, add projects, and start receiving inquiries at no cost.'
		},
		{
			q: 'Why list if I\'m already getting customers?',
			a: 'Most solar buyers research multiple installers before deciding. A verified profile on Solar Vipani makes you visible during that research phase — reaching customers you\'d otherwise miss.'
		}
	];
</script>

<div class="min-h-screen bg-background text-foreground">
	<!-- Hero -->
	<section class="px-4 py-20 md:py-28 text-center max-w-3xl mx-auto">
		<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">Grow Your Solar Business</h1>
		<p class="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
			Get discovered by customers researching solar installation online — completely free.
		</p>
		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<Button href="/in/login" size="lg">Login</Button>
			<Button href="https://solarvipani.com/in/business-form" variant="outline" size="lg">List My Business</Button>
		</div>
	</section>

	<!-- Benefits Grid -->
	<section class="px-4 py-16 max-w-5xl mx-auto">
		<h2 class="text-2xl md:text-3xl font-semibold text-center mb-10">Why Solar Installers Choose Us</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
			{#each benefits as b}
				<div class="rounded-xl border border-border bg-card p-6">
					<div class="text-2xl mb-2">{b.icon}</div>
					<h3 class="font-semibold text-lg mb-1">{b.title}</h3>
					<p class="text-muted-foreground text-sm">{b.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="px-4 py-12 bg-primary text-primary-foreground">
		<div class="max-w-3xl mx-auto flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 text-center">
			<div>
				<div class="text-3xl md:text-4xl font-bold">500+</div>
				<div class="text-sm opacity-90 mt-1">Businesses Listed</div>
			</div>
			<div>
				<div class="text-3xl md:text-4xl font-bold">5,000+</div>
				<div class="text-sm opacity-90 mt-1">Cities & Towns</div>
			</div>
		</div>
	</section>

	<!-- How It Works -->
	<section class="px-4 py-16 max-w-4xl mx-auto">
		<h2 class="text-2xl md:text-3xl font-semibold text-center mb-10">How It Works</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
			{#each steps as s}
				<div>
					<div class="w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto mb-4">{s.num}</div>
					<h3 class="font-semibold text-lg mb-1">{s.title}</h3>
					<p class="text-muted-foreground text-sm">{s.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- FAQ -->
	<section class="px-4 py-16 max-w-2xl mx-auto">
		<h2 class="text-2xl md:text-3xl font-semibold text-center mb-10">Frequently Asked Questions</h2>
		<div class="divide-y divide-border">
			{#each faqs as faq}
				<details class="group py-4">
					<summary class="flex cursor-pointer items-center justify-between text-sm font-medium hover:underline">
						{faq.q}
						<svg class="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
					</summary>
					<p class="pt-2 pb-1 text-sm text-muted-foreground">{faq.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<!-- Footer CTA -->
	<section class="px-4 py-16 text-center bg-card border-t border-border">
		<h2 class="text-2xl md:text-3xl font-semibold mb-4">Ready to Grow?</h2>
		<p class="text-muted-foreground mb-6">Join hundreds of solar businesses already on Solar Vipani.</p>
		<div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
			<Button href="/in/login" size="lg">Login</Button>
			<Button href="https://solarvipani.com/in/business-form" variant="outline" size="lg">List My Business</Button>
		</div>
		<div class="text-sm text-muted-foreground space-y-1">
			<p>admin@solarvipani.com</p>
			<p>+91 8983066701</p>
		</div>
	</section>
</div>
