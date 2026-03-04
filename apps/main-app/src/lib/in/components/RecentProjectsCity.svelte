<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { formatDate, formatBusinessName } from '$lib/constants/projectFormatters';

	// Get city and projects from page data
	let city = $derived($page.data.city);
	let projects = $derived($page.data.recentProjects || []);

	// Get image URL
	function getImageUrl(cloudinaryId: string | null, imageUrl: string | null): string {
		if (cloudinaryId) {
			return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300,q_auto,f_auto/${cloudinaryId}`;
		}
		return imageUrl || '';
	}
</script>

{#if projects.length > 0}
	<Card.Root class="border-0 shadow-[theme(--shadow-lg)] mb-8">
		<Card.Header class="text-center pb-[theme(--card-padding-y)]">
			<Card.Title class="text-3xl md:text-4xl font-semibold mb-4 text-primary">
				Recent Solar Panel Installation Projects in {city?.replace('-', ' ')}
			</Card.Title>
			<div class="flex justify-center items-center my-4">
				<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
			</div>
		</Card.Header>

		<Card.Content>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)] mb-8">
				{#each projects as project (project.id)}
					<a
						href="/in/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
						rel="noopener"
						class="group"
					>
						<Card.Root class="overflow-hidden h-full card-interactive">
							<div class="aspect-square overflow-hidden">
								{#if project.cloudinary_public_id}
									<img
										src={getImageUrl(project.cloudinary_public_id, null)}
										alt="{project.title} - Solar installation project in {project.pincode || 'India'}"
										class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[theme(--duration-slow)]"
										loading="lazy"
									/>
								{:else if project.image_url}
									<img
										src={project.image_url}
										alt="{project.title} - Solar installation project in {project.pincode || 'India'}"
										class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[theme(--duration-slow)]"
										loading="lazy"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center bg-muted">
										<span class="text-muted-foreground">No Image</span>
									</div>
								{/if}
							</div>

							<Card.Content class="pt-4">
								<h3 class="line-clamp-2 text-primary font-semibold text-lg mb-3">
									{project.title}
								</h3>
								<div class="text-muted-foreground flex flex-col gap-1 text-sm">
									<p>Pincode: {project.pincode || "N/A"}</p>
									<p>Completed on: {formatDate(project.project_date)}</p>
									<p>
										Installer: <span class="text-foreground font-medium">
											{formatBusinessName(project.business_slug)}
										</span>
									</p>
								</div>
							</Card.Content>
						</Card.Root>
					</a>
				{/each}
			</div>

			{#if projects.length >= 6}
				<div class="text-center">
					<a href="/in/recent-solar-installation-projects-in/{city?.replace('-', '-')}" class="inline-block text-primary-foreground font-semibold bg-primary hover:bg-primary-hover hover:-translate-y-[theme(--hover-lift-sm)] px-[theme(--button-padding-x-default)] py-[theme(--button-padding-y-default)] rounded-[theme(--radius-lg)] transition-all duration-[theme(--transition-default)]">View All Projects →</a>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/if}
