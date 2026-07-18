<script lang="ts">
	import { breadcrumbLD } from '$lib/seo';
	import { CheckCircle } from '@lucide/svelte';

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: 'Partners', url: 'https://solarvipani.com/in/partners/' },
		{ name: 'Thank You', url: 'https://solarvipani.com/in/partners/join/thank-you/' }
	]);
</script>

<svelte:head>
	<title>Thank You | Partner Sign-Up | Solar Vipani</title>
	<meta name="description" content="Thank you for signing up as a Solar Vipani partner. Our team will review your application and contact you within 48 hours." />
	<meta name="robots" content="noindex" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
</svelte:head>

<div class="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center">
	<CheckCircle class="mb-6 h-16 w-16 text-green-600" />

	<h1 class="mb-4 text-3xl font-bold text-foreground">Thank You for Signing Up</h1>

	<p class="mb-6 text-lg text-muted-foreground">
		We have received your partner application. Our team will review your details and get in touch within <strong class="text-foreground">48 hours</strong>.
	</p>

	<div class="mb-8 w-full rounded-lg border bg-muted/50 p-6">
		<h2 class="mb-3 text-lg font-semibold text-foreground">What Happens Next</h2>
		<ol class="space-y-2 text-left text-sm text-muted-foreground">
			<li><span class="font-medium text-foreground">1.</span> Our team reviews your business details</li>
			<li><span class="font-medium text-foreground">2.</span> We verify your business and contact you</li>
			<li><span class="font-medium text-foreground">3.</span> Your profile goes live and you start receiving leads</li>
		</ol>
	</div>

	<a href="/in/partners/" class="text-sm text-primary hover:underline">
		Back to Partners
	</a>
</div>
