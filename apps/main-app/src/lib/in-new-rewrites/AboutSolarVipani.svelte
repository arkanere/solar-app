<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { SOCIAL_LINKS, scrollToElement } from '$lib/constants/social';

	function handleScroll() {
		scrollToElement('lead-form-sv');
	}
</script>

<Card class="w-full border-0" style="margin-bottom: var(--card-gap); box-shadow: var(--shadow-md);">
	<CardHeader class="text-center">
		<CardTitle style="font-size: var(--font-size-3xl); line-height: var(--font-size-3xl--line-height); letter-spacing: var(--tracking-heading);">About Solarvipani</CardTitle>
		<div style="height: 0.25rem; width: 5rem; background-color: hsl(var(--secondary)); margin-left: auto; margin-right: auto; margin-top: var(--form-element-field-gap);"></div>
	</CardHeader>

	<CardContent style="gap: var(--card-gap); display: flex; flex-direction: column;">
		<!-- About Container -->
		<div class="flex items-center md:flex-col md:text-center" style="gap: var(--card-gap);">
			<img
				src="/logo.webp"
				alt="Solarvipani Logo"
				class="w-48 h-auto rounded-lg"
				style="box-shadow: var(--shadow-sm);"
				loading="lazy"
			/>

			<div class="flex-1" style="gap: var(--form-element-field-gap); display: flex; flex-direction: column;">
				<p style="font-size: var(--font-size-lg); line-height: var(--font-size-lg--line-height);">
					We are your premier marketplace aggregator dedicated to connecting residential and business
					customers with
					<a
						href="/in/blogs/hiring-verified-solar-installer-in-india-is-essential"
						style="font-weight: 600; color: hsl(var(--primary)); text-decoration: underline;"
					>
						Best Local Solar Panel Installation
					</a>
					companies, ensuring that you make smart decisions backed by credible information and have a
					hassle-free experience.
				</p>
				<p style="font-size: var(--font-size-lg); line-height: var(--font-size-lg--line-height);">
					Our platform is designed for smart homeowners and businesses ready to go solar but unsure where to
					start.
					<Button
						variant="ghost"
						style="padding: 0; height: auto; font-weight: 600; color: hsl(var(--primary)); text-decoration: underline;"
						onclick={handleScroll}
					>
						Get 2-3 free quotes from verified installers in your area
					</Button>
					and compare prices to find the best solution for your needs.
				</p>
			</div>
		</div>

		<!-- Social Media Links -->
		<div class="w-full" style="padding-top: var(--card-padding-y); border-top: 1px solid hsl(var(--border));">
			<h4 style="text-align: center; font-size: var(--font-size-lg); font-weight: 600; margin-bottom: var(--form-element-field-gap);">Follow us on:</h4>
			<div class="flex justify-center flex-wrap" style="gap: var(--card-gap);">
				{#each SOCIAL_LINKS as link (link.url)}
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={link.label}
						class="flex items-center"
						style="gap: var(--form-element-field-gap); color: hsl(var(--primary)); transition: all var(--transition-default);"
						onmouseenter={(e) => {
							e.currentTarget.style.color = `hsl(var(--primary) / 0.8)`;
							e.currentTarget.style.transform = 'translateY(-0.25rem)';
						}}
						onmouseleave={(e) => {
							e.currentTarget.style.color = `hsl(var(--primary))`;
							e.currentTarget.style.transform = 'translateY(0)';
						}}
					>
						<link.icon size={20} />
						<span style="font-size: var(--font-size-sm); font-weight: 500;">{link.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</CardContent>
</Card>
