<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { SOCIAL_LINKS, scrollToElement } from '$lib/constants/social';

	let hoveredLink: string | null = $state(null);

	function handleScroll() {
		scrollToElement('lead-form-sv');
	}

	function handleSocialHover(url: string) {
		hoveredLink = url;
	}

	function handleSocialLeave() {
		hoveredLink = null;
	}
</script>

<Card class="w-full border-0 mt-[theme(--spacing-component-between)] mb-[theme(--spacing-component-between)] shadow-card">
	<CardHeader class="text-center">
		<CardTitle class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-component-internal)]">
			About Solarvipani
		</CardTitle>
		<div class="flex justify-center items-center my-[theme(--spacing-component-internal)]">
			<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-foreground-muted rounded"></span>
		</div>
	</CardHeader>

	<CardContent class="gap-[theme(--spacing-component-between)] flex flex-col">
		<!-- About Container -->
		<div class="flex items-center md:flex-col md:text-center gap-[theme(--spacing-component-between)]">
			<img
				src="/logo.webp"
				alt="Solarvipani Logo"
				class="w-48 h-auto rounded-[theme(--radius-lg)] shadow-card"
				loading="lazy"
			/>

			<div class="flex-1 gap-[theme(--form-element-field-gap)] flex flex-col">
				<p class="text-lg">
					We are your premier marketplace aggregator dedicated to connecting residential and business
					customers with
					<a
						href="/in/blogs/hiring-verified-solar-installer-in-india-is-essential"
						class="font-semibold text-primary underline hover:opacity-80 transition-opacity"
					>
						Best Local Solar Panel Installation
					</a>
					companies, ensuring that you make smart decisions backed by credible information and have a
					hassle-free experience.
				</p>
				<p class="text-lg">
					Our platform is designed for smart homeowners and businesses ready to go solar but unsure where to
					start.
					<Button
						variant="ghost"
						class="p-0 h-auto font-semibold text-primary underline"
						onclick={handleScroll}
					>
						Get 2-3 free quotes from verified installers in your area
					</Button>
					and compare prices to find the best solution for your needs.
				</p>
			</div>
		</div>

		<!-- Social Media Links -->
		<div class="w-full pt-[theme(--card-padding)] border-t border-border">
			<h4 class="text-center text-lg font-semibold mb-[theme(--form-element-field-gap)]">Follow us on:</h4>
			<div class="flex justify-center flex-wrap gap-[theme(--spacing-component-internal)]">
				{#each SOCIAL_LINKS as link (link.url)}
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={link.label}
						class="flex items-center gap-[theme(--form-element-field-gap)] transition-all duration-[theme(--transition-default)] hover:opacity-90"
						onmouseenter={() => handleSocialHover(link.url)}
						onmouseleave={handleSocialLeave}
					>
						<link.icon size={20} />
						<span class="text-sm font-medium">{link.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</CardContent>
</Card>
