<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { SOCIAL_LINKS } from '$lib/constants/social';
	import { Users, TrendingUp } from '@lucide/svelte';

	interface Props {
		installerCount: number;
		leadsGenerated: number;
	}

	let { installerCount, leadsGenerated }: Props = $props();

	const stats = $derived([
		{ label: 'Verified Installers on the Platform', value: installerCount, icon: Users },
		{ label: 'Leads Generated Across India', value: leadsGenerated, icon: TrendingUp }
	]);

	let hoveredLink: string | null = $state(null);

	function handleSocialHover(url: string) {
		hoveredLink = url;
	}

	function handleSocialLeave() {
		hoveredLink = null;
	}
</script>

<Card class="w-full border-0 mt-8 mb-[theme(--card-gap)] shadow-[theme(--shadow-md)]">
	<CardHeader class="text-center">
		<CardTitle class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
			About Solarvipani
		</CardTitle>
		<div class="flex justify-center items-center my-4">
			<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
		</div>
	</CardHeader>

	<CardContent class="px-[theme(--card-padding-y)] gap-[theme(--card-gap)] flex flex-col">
		<!-- About Container -->
		<div class="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-[theme(--card-gap)]">
			<img
				src="/logo.webp"
				alt="Solarvipani Logo"
				class="w-48 h-auto rounded-[theme(--radius-lg)] shadow-[theme(--shadow-sm)]"
				loading="lazy"
			/>

			<div class="flex-1 w-full gap-[theme(--form-element-field-gap)] flex flex-col">
				<p class="text-lg">
					Going solar is a decision you live with for 25 years, and it involves investing a
					significant amount of money. Solar Vipani helps homeowners and businesses make that
					decision wisely — we connect you with the best local solar panel installation
					companies and back every choice with credible, up-to-date information.
				</p>
				<p class="text-lg">
					We believe in complete transparency: our platform is open source, and our guides are
					written to educate you before you spend a single rupee. Compare multiple options —
					get 2-3 free quotes from verified installers in your area — and choose the solution
					that is right for your home or business.
				</p>
			</div>
		</div>

		<!-- Trust Stats -->
		<div class="grid grid-cols-2 gap-4">
			{#each stats as stat (stat.label)}
				<div class="flex flex-col items-center gap-2 rounded-lg bg-muted p-4 text-center">
					<stat.icon class="h-6 w-6 text-primary" />
					<span class="text-2xl font-bold text-foreground md:text-3xl">{stat.value.toLocaleString('en-IN')}+</span>
					<span class="text-sm text-muted-foreground">{stat.label}</span>
				</div>
			{/each}
		</div>

		<!-- Social Media Links -->
		<div class="w-full pt-[theme(--card-padding-y)] border-t border-[hsl(var(--border))]">
			<h4 class="text-center text-lg font-semibold mb-[theme(--form-element-field-gap)]">Follow us on:</h4>
			<div class="flex justify-center flex-wrap gap-[theme(--card-gap)]">
				{#each SOCIAL_LINKS as link (link.url)}
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={link.label}
						class="flex items-center gap-[theme(--form-element-field-gap)] text-primary transition-all duration-[theme(--duration-default)]"
						class:hover-lift-sm={hoveredLink === link.url}
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
