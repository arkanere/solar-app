<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Phone, MessageCircle, MapPin } from '@lucide/svelte';
	import { makeCall, openWhatsApp } from '$lib/constants/businessTracking';
	import { capture } from '$lib/posthog';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { businesses, countryCode = 'in' }: { businesses: any[]; countryCode?: string } = $props();

	function getProjectImageUrl(cloudinaryId: string): string {
		return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_64,h_64,q_auto,f_auto/${cloudinaryId}`;
	}
</script>

{#if businesses.length > 0}
	<section class="mx-auto w-full max-w-4xl flex flex-col gap-4 px-4 my-6">
		{#each businesses as business}
			<Card.Root class="shadow-sm transition-shadow">
				<Card.Header class="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b gap-2 pb-4">
					<h3 class="text-xl font-semibold">
						<a
							href={`/${countryCode}/installer/${business.slug}/`}
							onclick={() => capture('installer_card_clicked', { business_slug: business.slug, city: business.city })}
							class="text-primary hover:opacity-80 underline-offset-2 hover:underline transition-all"
						>
							{business.businessname}
						</a>
					</h3>
					{#if business.tag}
						<Badge variant="secondary" class="whitespace-nowrap">
							<span class="inline-flex items-center justify-center w-4 h-4 mr-1 rounded-full text-success-foreground bg-success text-xs font-bold">
								✓
							</span>
							{business.tag}
						</Badge>
					{/if}
				</Card.Header>

				<Card.Content class="flex flex-col gap-2">
					<div class="flex items-start text-foreground-secondary gap-2">
						<MapPin class="w-5 h-5 text-primary shrink-0 mt-0.5" />
						<span>{business.address || `${business.city}, ${business.state}`}</span>
					</div>
					{#if business.phonenumber}
						<div class="flex items-center text-foreground-secondary gap-2">
							<Phone class="w-5 h-5 text-primary shrink-0" />
							<a
								href={`tel:${business.phonenumber}`}
								class="text-primary hover:opacity-80 hover:underline transition-all"
							>
								{business.phonenumber}
							</a>
						</div>
					{/if}

					{#if business.recent_projects?.length}
						<div class="flex items-center gap-3 pt-2">
							<span class="text-xs text-muted-foreground">Recent Work</span>
							<div class="flex gap-2">
								{#each business.recent_projects.slice(0, 3) as project}
									<a
										href="/{countryCode}/project/{project.project_slug}/"
										class="group block"
										aria-label="View {project.title}"
									>
										{#if project.cloudinary_public_id}
											<img
												src={getProjectImageUrl(project.cloudinary_public_id)}
												alt={project.title}
												class="w-14 h-14 rounded-md object-cover transition-transform duration-200 group-hover:scale-105 shadow-sm"
												loading="lazy"
											/>
										{/if}
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</Card.Content>

				<div class="flex flex-col sm:flex-row gap-2 p-4">
					{#if business.phonenumber}
						<Button
							variant="default"
							class="bg-destructive hover:bg-destructive-hover flex-1 sm:flex-none"
							onclick={() => makeCall(business.phonenumber, business.city, business.slug)}
						>
							<Phone class="w-4 h-4" />
							CALL NOW
						</Button>
						<Button
							variant="default"
							class="bg-success hover:bg-success-hover flex-1 sm:flex-none"
							onclick={() => openWhatsApp(business.phonenumber, business.city, business.slug)}
						>
							<MessageCircle class="w-4 h-4" />
							WHATSAPP
						</Button>
					{/if}
				</div>
			</Card.Root>
		{/each}
	</section>
{/if}
