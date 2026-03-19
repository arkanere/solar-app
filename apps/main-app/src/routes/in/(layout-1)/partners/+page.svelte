<script lang="ts">
	import { breadcrumbLD, faqLD, organizationLD } from '$lib/seo';
	import NetworkStats from '$lib/in/components/seo/NetworkStats.svelte';
import AboutSolarVipani from '$lib/in/components/AboutSolarVipani.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import {
		ArrowRight,
		Shield,
		BarChart3,
		Layout,
		Compass,
		Mail as MailIcon,
		Phone,
		Image,
		MapPin,
		CheckCircle,
		Building
	} from '@lucide/svelte';

	let { data } = $props();

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: 'Partners', url: 'https://solarvipani.com/in/partners/' }
	]);

	const faqs = [
		{
			question: 'What is Solar Vipani?',
			answer:
				"Solar Vipani is India's leading platform connecting customers actively seeking solar installation with verified solar installers. We help grow your business by giving you direct access to qualified leads in your area."
		},
		{
			question: 'How much does it cost to list my business?',
			answer:
				'Listing your business is completely free of charge. We believe in providing value first and helping solar businesses grow their online presence without any upfront costs.'
		},
		{
			question: "Why should I list my business if I'm already getting customers?",
			answer:
				"Even if you have a steady customer base, listing on Solar Vipani significantly increases your online visibility, helping you reach even more potential customers who are actively searching for solar installation services. It's an additional channel that complements your existing marketing efforts."
		}
	];

	const faqSchema = faqLD(faqs);
	const orgSchema = organizationLD();

	const serviceSchema = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'Solar Installer Partner Network',
		description:
			'Free partnership program for solar panel installers to receive verified leads and grow their business',
		provider: { '@type': 'Organization', name: 'Solar Vipani' },
		serviceType: 'Business Directory',
		areaServed: { '@type': 'Country', name: 'India' },
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'INR',
			description: 'Free partnership for solar installers'
		}
	};

	const benefits = [
		{
			icon: Compass,
			title: 'Get Discovered Online',
			description:
				'Customers search for "Solar Panel Installers Near Me". We rank on the first page of Google, ChatGPT, and more for these queries.'
		},
		{
			icon: BarChart3,
			title: 'Verified Leads',
			description:
				'Receive qualified leads from homeowners actively looking for solar installation in your service area.'
		},
		{
			icon: Layout,
			title: 'Business Dashboard',
			description:
				'Manage your profile, track leads, and showcase completed projects from a single dashboard.'
		},
		{
			icon: Image,
			title: 'Post Recent Projects',
			description:
				'Showcase your workmanship to potential customers with project photos and details.'
		},
		{
			icon: Shield,
			title: 'Verified Badge',
			description:
				'Build trust with a verified installer badge that boosts customer confidence in your business.'
		},
		{
			icon: Building,
			title: 'Multiple Branch Offices',
			description:
				'Expand your reach by managing multiple branch locations under one main business profile.'
		}
	];

</script>

<svelte:head>
	<title>Partner with Solar Vipani | India's Solar Installer Network</title>
	<meta
		name="description"
		content="Join India's fastest-growing solar installer network. Get verified leads, showcase your projects, and grow your solar business — completely FREE. {data.installerCount}+ installers across {data.citiesServed}+ cities."
	/>
	<link rel="canonical" href="https://solarvipani.com/in/partners/" />
	<meta
		name="keywords"
		content="solar business listing, solar panel installer directory, solar installer network, solar business growth, solar marketing India"
	/>
	<meta name="author" content="Solar Vipani" />
	<meta name="robots" content="index, follow" />

	<!-- Preload hero image -->
	<link rel="preload" as="image" href="/header/header.avif" fetchpriority="high" />
	<link rel="preconnect" href="https://www.youtube.com" />
	<link rel="preconnect" href="https://connect.facebook.net" />

	<!-- Open Graph -->
	<meta property="og:title" content="Partner with Solar Vipani | India's Solar Installer Network" />
	<meta
		property="og:description"
		content="Join India's fastest-growing solar installer network. Get verified leads and grow your solar business — completely FREE."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://solarvipani.com/in/partners/" />
	<meta
		property="og:image"
		content="https://solarvipani.com/images/solar-business-listing-og.jpg"
	/>
	<meta property="og:site_name" content="Solar Vipani" />
	<meta property="og:locale" content="en_IN" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Partner with Solar Vipani | India's Solar Installer Network"
	/>
	<meta
		name="twitter:description"
		content="Join India's fastest-growing solar installer network. Get verified leads and grow your solar business — completely FREE."
	/>
	<meta
		name="twitter:image"
		content="https://solarvipani.com/images/solar-business-listing-twitter.jpg"
	/>
	<meta name="twitter:site" content="@solarvipani" />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(orgSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}

	<!-- Facebook Pixel - Deferred -->
	<script>
		function loadFacebookPixel() {
			!(function (f, b, e, v, n, t, s) {
				if (f.fbq) return;
				n = f.fbq = function () {
					n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
				};
				if (!f._fbq) f._fbq = n;
				n.push = n;
				n.loaded = !0;
				n.version = '2.0';
				n.queue = [];
				t = b.createElement(e);
				t.async = !0;
				t.src = v;
				s = b.getElementsByTagName(e)[0];
				s.parentNode.insertBefore(t, s);
			})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
			fbq('init', '1226087962095221');
			fbq('track', 'PageView');
		}
		let pixelLoaded = false;
		function initPixel() {
			if (!pixelLoaded) {
				pixelLoaded = true;
				loadFacebookPixel();
			}
		}
		['mousedown', 'touchstart', 'keydown', 'scroll'].forEach((event) => {
			document.addEventListener(event, initPixel, { once: true, passive: true });
		});
		setTimeout(initPixel, 3000);
	</script>
	<noscript>
		<img
			height="1"
			width="1"
			style="display:none"
			src="https://www.facebook.com/tr?id=1226087962095221&ev=PageView&noscript=1"
			alt="Facebook Pixel"
		/>
	</noscript>
</svelte:head>

<main class="w-full bg-card text-foreground">
	<!-- Hero Banner -->
	<div
		class="relative flex h-[theme(--height-md)] w-full items-center justify-center overflow-hidden text-center md:h-[theme(--height-xl)]"
	>
		<img
			class="absolute inset-0 h-full w-full object-cover object-center"
			src="/header/header.avif"
			alt="Solar Panel Installation Partner Network"
			width="1920"
			height="600"
			fetchpriority="high"
			decoding="async"
		/>
		<div class="absolute inset-0 bg-black/55"></div>
		<div class="relative z-10 max-w-3xl px-6">
			<h1
				class="mb-4 text-4xl font-bold leading-tight text-primary-foreground drop-shadow-lg md:text-5xl"
			>
				Grow Your Solar Business
			</h1>
			<p class="mb-6 text-xl text-primary-foreground/90 drop-shadow-lg md:text-2xl">
				Join {data.installerCount.toLocaleString('en-IN')}+ verified installers — completely
				<span class="font-bold text-amber-300">FREE</span>
			</p>
			<a href="/in/partners/join/">
				<Button size="lg" class="gap-2 uppercase tracking-wider">
					Join as Partner <ArrowRight class="h-4 w-4" />
				</Button>
			</a>
		</div>
	</div>

	<div class="mx-auto max-w-[1140px] p-[theme(--container-padding)]">
		<!-- Breadcrumb -->
		<nav class="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
			<ol class="flex flex-wrap gap-1">
				<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
				<li class="font-medium text-foreground">Partners</li>
			</ol>
		</nav>

		<!-- Network Stats -->
		<section class="mb-8">
			<NetworkStats
				installerCount={data.installerCount}
				citiesServed={data.citiesServed}
				projectsCompleted={data.projectsCompleted}
				leadsGenerated={data.leadsGenerated}
			/>
		</section>

		<!-- Benefits -->
		<Card class="mb-8 p-[theme(--card-padding-y)]">
			<div class="mb-8 text-center">
				<h2 class="mb-4 text-3xl font-semibold text-primary md:text-4xl">
					Why Partner with Solar Vipani?
				</h2>
				<div class="my-4 flex items-center justify-center">
					<span class="h-1 w-20 rounded bg-accent"></span>
				</div>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Get discovered by customers ready to install solar panels — completely
					<span class="font-bold text-accent">FREE</span>
				</p>
			</div>

			<div class="mb-8 grid grid-cols-1 gap-[theme(--card-gap)] md:grid-cols-3">
				{#each benefits as benefit}
					<div
						class="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 text-center"
					>
						<div
							class="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
						>
							<benefit.icon class="h-7 w-7 text-primary" />
						</div>
						<h3 class="text-lg font-semibold text-foreground">{benefit.title}</h3>
						<p class="text-sm text-muted-foreground">{benefit.description}</p>
					</div>
				{/each}
			</div>

			<div class="mt-8 text-center">
				<a href="/in/partners/join/">
					<Button class="gap-2 uppercase tracking-wider">
						Get Started for Free <ArrowRight class="h-4 w-4" />
					</Button>
				</a>
			</div>
		</Card>

		<!-- Recently Joined Verified Installers -->
		<Card class="mb-8 bg-primary/5 p-[theme(--card-padding-y)]">
			<div class="mb-8 text-center">
				<h2 class="mb-4 text-3xl font-semibold text-primary md:text-4xl">
					Recently Joined Verified Installers
				</h2>
				<div class="my-4 flex items-center justify-center">
					<span class="h-1 w-20 rounded bg-accent"></span>
				</div>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					These solar professionals recently joined our growing community
				</p>
			</div>

			<div class="mb-8 grid grid-cols-1 gap-[theme(--card-gap)] md:grid-cols-2 lg:grid-cols-3">
				{#if data.businesses && data.businesses.length > 0}
					{#each data.businesses as business}
						<a
							href={`/in/solar-panel-installer/${business.slug}/`}
							target="_blank"
							rel="noopener noreferrer"
							class="block no-underline"
						>
							<Card class="relative flex h-full flex-col overflow-hidden p-4">
								<div
									class="absolute right-1 top-1 flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white"
								>
									<CheckCircle class="h-3.5 w-3.5" />
									<span>Verified</span>
								</div>
								<h3 class="pr-20 text-lg font-semibold text-primary">
									{business.businessname}
								</h3>
								<div class="mt-auto flex flex-col gap-2 pt-3">
									<div
										class="flex items-center gap-2 text-sm text-muted-foreground"
									>
										<MapPin class="h-4 w-4 shrink-0" />
										<span>{business.city}, {business.state}</span>
									</div>
									<div
										class="flex items-center gap-2 text-sm text-muted-foreground"
									>
										<Phone class="h-4 w-4 shrink-0" />
										<span>{business.phonenumber}</span>
									</div>
								</div>
							</Card>
						</a>
					{/each}
				{:else}
					<div class="col-span-full py-12 text-center">
						<p class="text-muted-foreground">
							No verified installers available at the moment. Be the first to join!
						</p>
					</div>
				{/if}
			</div>

			<div class="mt-8 text-center">
				<a href="/in/partners/join/">
					<Button class="gap-2 uppercase tracking-wider">
						Join These Businesses <ArrowRight class="h-4 w-4" />
					</Button>
				</a>
			</div>
		</Card>

		<!-- How It Works Video -->
		<Card class="mb-8 p-[theme(--card-padding-y)] text-center" id="product-working">
			<div class="mb-8 text-center">
				<h2 class="mb-4 text-3xl font-semibold text-primary md:text-4xl">See How It Works</h2>
				<div class="my-4 flex items-center justify-center">
					<span class="h-1 w-20 rounded bg-accent"></span>
				</div>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Watch this quick video to understand how Solar Vipani connects you with customers
				</p>
			</div>

			<div
				class="relative mx-auto max-w-2xl overflow-hidden rounded-[theme(--radius-lg)] shadow-[theme(--shadow-lg)]"
			>
				<iframe
					class="aspect-video w-full border-0"
					src="https://www.youtube.com/embed/8UZ-4XN8Vq8"
					title="How Solarvipani.com works"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
					loading="lazy"
				></iframe>
			</div>

			<div class="mt-8 text-center">
				<a href="/in/partners/join/">
					<Button class="gap-2 uppercase tracking-wider">
						Try It Now — Free <ArrowRight class="h-4 w-4" />
					</Button>
				</a>
			</div>
		</Card>

		<!-- FAQs -->
		<Card class="mb-8 p-[theme(--card-padding-y)]">
			<div class="mb-8 text-center">
				<h2 class="mb-4 text-3xl font-semibold text-primary md:text-4xl">
					Frequently Asked Questions
				</h2>
				<div class="my-4 flex items-center justify-center">
					<span class="h-1 w-20 rounded bg-accent"></span>
				</div>
			</div>

			<div class="mx-auto flex max-w-2xl flex-col items-center gap-[theme(--card-gap)]">
				{#each faqs as faq}
					<Card class="w-full p-4">
						<h3 class="mb-3 text-lg font-semibold text-primary">{faq.question}</h3>
						<p class="text-sm text-muted-foreground">{faq.answer}</p>
					</Card>
				{/each}
			</div>
		</Card>

		<!-- Help / Contact -->
		<Card class="mb-8 p-[theme(--card-padding-y)]">
			<div class="mb-8 text-center">
				<h2 class="mb-4 text-3xl font-semibold text-primary md:text-4xl">
					We're Here to Help
				</h2>
				<div class="my-4 flex items-center justify-center">
					<span class="h-1 w-20 rounded bg-accent"></span>
				</div>
			</div>

			<div class="flex flex-wrap justify-center gap-8">
				<Card class="w-64 p-4 text-center">
					<div class="mb-4 flex justify-center text-primary">
						<MailIcon class="h-6 w-6" />
					</div>
					<p class="mb-2 text-muted-foreground">Email us at</p>
					<a
						href="mailto:admin@solarvipani.com"
						class="block text-lg font-semibold text-primary transition-colors hover:underline"
						rel="noopener">admin@solarvipani.com</a
					>
				</Card>

				<Card class="w-64 p-4 text-center">
					<div class="mb-4 flex justify-center text-primary">
						<Phone class="h-6 w-6" />
					</div>
					<p class="mb-2 text-muted-foreground">Call us at</p>
					<a
						href="tel:+918983066701"
						class="block text-lg font-semibold text-primary transition-colors hover:underline"
						rel="noopener">+91 8983066701</a
					>
				</Card>
			</div>
		</Card>

		<!-- About Solar Vipani -->
		<AboutSolarVipani />
	</div>
</main>
