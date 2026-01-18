<script lang="ts">
	import { isDarkMode } from '$lib/themeStore.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { SOCIAL_LINKS, scrollToElement } from '$lib/constants/social';

	const darkMode = isDarkMode;

	function handleScroll() {
		scrollToElement('lead-form-sv');
	}
</script>

<Card class="w-full mb-8 border-0 shadow-md">
	<CardHeader class="text-center">
		<CardTitle class="text-3xl md:text-2xl sm:text-xl">About Solarvipani</CardTitle>
		<div class="h-1 w-20 bg-secondary mx-auto mt-4"></div>
	</CardHeader>

	<CardContent class="space-y-6">
		<!-- About Container -->
		<div class="flex items-center gap-8 md:flex-col md:text-center">
			<img
				src="/logo.webp"
				alt="Solarvipani Logo"
				class="w-48 h-auto rounded-lg shadow-sm"
				loading="lazy"
			/>

			<div class="flex-1 space-y-4">
				<p class="text-lg leading-relaxed">
					We are your premier marketplace aggregator dedicated to connecting residential and business
					customers with
					<a
						href="/in/blogs/hiring-verified-solar-installer-in-india-is-essential"
						class="font-semibold text-primary hover:underline"
					>
						Best Local Solar Panel Installation
					</a>
					companies, ensuring that you make smart decisions backed by credible information and have a
					hassle-free experience.
				</p>
				<p class="text-lg leading-relaxed">
					Our platform is designed for smart homeowners and businesses ready to go solar but unsure where to
					start.
					<Button
						variant="ghost"
						class="p-0 h-auto font-semibold text-blue-600 hover:bg-transparent hover:underline dark:text-blue-400"
						on:click={handleScroll}
					>
						Get 2-3 free quotes from verified installers in your area
					</Button>
					and compare prices to find the best solution for your needs.
				</p>
			</div>
		</div>

		<!-- Social Media Links -->
		<div class="w-full pt-6 border-t">
			<h4 class="text-center text-lg font-semibold mb-4">Follow us on:</h4>
			<div class="flex justify-center gap-6 flex-wrap">
				{#each SOCIAL_LINKS as link (link.url)}
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={link.label}
						class="flex items-center gap-2 text-primary hover:text-primary/80 hover:-translate-y-1 transition-all"
					>
						<link.icon size={20} />
						<span class="text-sm font-medium">{link.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</CardContent>
</Card>
