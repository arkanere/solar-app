<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { SOCIAL_LINKS } from '$lib/constants/social';
	import { Users, MapPin, TrendingUp, Github, Scale, BookOpen, LifeBuoy } from '@lucide/svelte';

	let { data } = $props();

	// installerCount and leadsGenerated come from routes/(layout-1)/+layout.server.ts;
	// citiesServed from this page's own loader. Nothing here is a hardcoded
	// figure — the page used to claim "500+" businesses and "5,000+ Cities &
	// Towns" against 470 and 356 actual.
	const stats = $derived([
		{ value: data.aboutStats.installerCount, label: 'Installers on the Platform', icon: Users },
		{ value: data.citiesServed, label: 'Cities Served', icon: MapPin },
		{ value: data.aboutStats.leadsGenerated, label: 'Leads Generated', icon: TrendingUp }
	]);

	const REPO_URL = 'https://github.com/arkanere/solar-app';
</script>

<svelte:head>
	<title>About Us | Solar Vipani — Open Source Solar Marketplace</title>
	<meta
		name="description"
		content="Solar Vipani connects homeowners and businesses with local solar installers, and publishes the guides and tools to decide before you spend. Our platform is open source."
	/>
	<link rel="canonical" href="https://solarvipani.com/about-us" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'About Solar Vipani',
		url: 'https://solarvipani.com/about-us',
		mainEntity: {
			'@type': 'Organization',
			name: 'Solar Vipani',
			url: 'https://solarvipani.com',
			logo: 'https://solarvipani.com/logo512.png',
			description:
				'An open source marketplace connecting homeowners and businesses with local solar installers.',
			email: 'admin@solarvipani.com',
			telephone: '+91-8983066701',
			sameAs: [...SOCIAL_LINKS.map((l) => l.url), REPO_URL]
		}
	})}<\/script>`}
</svelte:head>

<PageShell>
	<PageHeader
		title="About Solar Vipani"
		lede="Your trusted marketplace for solar energy solutions."
	/>

	<section>
		<p class="text-lg font-medium text-primary-strong mb-6">
			Going solar is a decision you live with for 25 years, and it involves a significant amount
			of money.
		</p>
		<p class="text-base leading-relaxed mb-6">
			Most people start that decision with no way to tell a good installer from a bad one, and no
			independent source for what a system should cost. Solar Vipani exists to close that gap. We
			are not a manufacturer and not an installer — we are the layer in between: a marketplace
			that connects you with local solar installation and EPC companies, and a library of guides
			and tools that let you judge their quotes for yourself.
		</p>
		<p class="bg-accent-muted rounded-[theme(--radius-md)] p-4 text-base font-medium mb-6">
			Compare multiple options, get free quotes from installers near you, and choose with the
			numbers in front of you.
		</p>
		<p class="text-base leading-relaxed">
			Listing is free for installers, and we never charge you for a quote. You decide who to talk
			to, and you keep control of your details until you do.
		</p>
	</section>

	<section>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-[theme(--card-gap)]">
			{#each stats as stat (stat.label)}
				<Card
					class="p-4 border-t-[theme(--card-accent-border)] border-accent card-interactive text-center"
				>
					<stat.icon class="h-6 w-6 text-primary-strong mx-auto mb-2" />
					<div class="text-4xl font-bold text-primary-strong mb-2">
						{stat.value.toLocaleString('en-IN')}+
					</div>
					<h2 class="text-lg font-semibold text-primary-strong">{stat.label}</h2>
				</Card>
			{/each}
		</div>
		<p class="text-sm text-muted-foreground text-center mt-4">
			Counted live from our database, across every country we operate in.
		</p>
	</section>

	<section>
		<PageHeader as="h2" title="Our Purpose" />
		<p class="text-base leading-relaxed">
			We believe going solar should be a straightforward, well-informed choice for everyone. Our
			mission is to make the transition as smooth as possible by <strong
				>connecting you with solar providers who match your specific needs and goals</strong
			>, and by giving you enough information to know why they match. A decision that lasts 25
			years deserves more than a single quote from whoever knocked on your door.
		</p>
	</section>

	<section>
		<PageHeader as="h2" title="Built in the Open" />
		<p class="text-base leading-relaxed mb-6">
			A marketplace asks you to trust how it ranks and matches. We would rather you did not have
			to take that on faith: <strong>Solar Vipani is open source</strong>. The code behind this
			site — how installers are matched to an enquiry, how our calculators work, how your data is
			handled — is public and MIT licensed. Read it, check our claims against it, or use it in
			your own project.
		</p>
		<div class="text-center">
			<Button href={REPO_URL} target="_blank" rel="noopener noreferrer" size="lg">
				<Github class="h-5 w-5" />
				View the source on GitHub
			</Button>
		</div>
	</section>

	<section>
		<PageHeader as="h2" title="What You'll Find Here" />
		<div class="grid grid-cols-1 md:grid-cols-2 gap-[theme(--card-gap)]">
			<Card class="p-4 card-interactive">
				<h3 class="text-lg font-semibold text-primary-strong mb-3">Local installer listings</h3>
				<p class="text-sm leading-relaxed">
					Browse solar companies by state, district and city, see the work they have completed,
					and request quotes from more than one before you commit.
				</p>
			</Card>
			<Card class="p-4 card-interactive">
				<h3 class="text-lg font-semibold text-primary-strong mb-3">Guides that explain the choice</h3>
				<p class="text-sm leading-relaxed">
					Independent writing on rooftop solar, panels, inverters, solar pumps, subsidies and
					financing — written to educate before you spend, not to sell a brand.
				</p>
			</Card>
			<Card class="p-4 card-interactive">
				<h3 class="text-lg font-semibold text-primary-strong mb-3">Calculators and tools</h3>
				<p class="text-sm leading-relaxed">
					Size a system against your electricity bill, check what subsidy you qualify for, and
					work out EMIs — so you can sanity-check a quote before you sign it.
				</p>
			</Card>
			<Card class="p-4 card-interactive">
				<h3 class="text-lg font-semibold text-primary-strong mb-3">Real installation projects</h3>
				<p class="text-sm leading-relaxed">
					Photos, system sizes and locations from installations completed by companies on the
					platform, published by the installers themselves.
				</p>
			</Card>
		</div>
	</section>

	<section>
		<PageHeader as="h2" title="Why Choose Solar Vipani?" />
		<div class="grid grid-cols-1 md:grid-cols-2 gap-[theme(--card-gap)]">
			<Card class="p-4 card-interactive text-center">
				<Scale class="h-10 w-10 text-primary-strong mb-4 mx-auto block" />
				<h3 class="text-lg font-semibold text-primary-strong mb-3">Effortless Comparisons</h3>
				<p class="text-sm leading-relaxed">
					Comparing options is as easy as browsing. See service area, completed work and contact
					details side by side, at a glance.
				</p>
			</Card>
			<Card class="p-4 card-interactive text-center">
				<BookOpen class="h-10 w-10 text-primary-strong mb-4 mx-auto block" />
				<h3 class="text-lg font-semibold text-primary-strong mb-3">Built to Inform, Not to Sell</h3>
				<p class="text-sm leading-relaxed">
					We do not manufacture or install anything, so we have no product to push. Our guides
					describe trade-offs, including the ones that argue against going solar right now.
				</p>
			</Card>
			<Card class="p-4 card-interactive text-center">
				<MapPin class="h-10 w-10 text-primary-strong mb-4 mx-auto block" />
				<h3 class="text-lg font-semibold text-primary-strong mb-3">Local, Not National</h3>
				<p class="text-sm leading-relaxed">
					Enquiries go to installers who actually work in your area, and to more than one of
					them, so you get comparable quotes from people who can service what they sell you.
				</p>
			</Card>
			<Card class="p-4 card-interactive text-center">
				<LifeBuoy class="h-10 w-10 text-primary-strong mb-4 mx-auto block" />
				<h3 class="text-lg font-semibold text-primary-strong mb-3">Customer-First Support</h3>
				<p class="text-sm leading-relaxed">
					Our team is here to guide you through every step, from an initial question to feedback
					after your system is installed.
				</p>
			</Card>
		</div>
	</section>

	<section>
		<PageHeader as="h2" title="Building a Brighter Future, Together" />
		<p class="text-base leading-relaxed mb-6">
			Choosing solar isn't only about savings; it's about what your roof is doing for the next 25
			years. Whether you are exploring the idea for the first time or already comparing quotes,
			we're here to make that path clear.
		</p>
		<p class="bg-accent-muted rounded-[theme(--radius-md)] p-4 text-center font-medium">
			Step into a greener future with Solar Vipani — high convenience, fair pricing and low risk,
			by design.
		</p>
	</section>

	<!-- Contact. The social links and the platform stats are deliberately not
	     repeated here: AboutSolarVipani renders both directly below this page,
	     as it does on every page in this layout. -->
	<section class="text-center">
		<p class="text-base mb-6">
			Write to us at
			<a href="mailto:admin@solarvipani.com" class="font-semibold text-link"
				>admin@solarvipani.com</a
			>
			<br />
			or call us at
			<a href="tel:+918983066701" class="font-semibold text-link">+91 8983066701</a>
		</p>

		<div class="border-t border-border pt-6">
			<p>
				<a href="/terms-of-use" class="text-link">Terms of Use</a>
				|
				<a href="/privacy-policy" class="text-link">Privacy Policy</a>
				|
				<a href={REPO_URL} target="_blank" rel="noopener noreferrer" class="text-link"
					>Source Code</a
				>
			</p>
		</div>
	</section>
</PageShell>
