<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { MapPin, Calendar, Wrench, Image as ImageIcon } from '@lucide/svelte';

	// Get city and projects from page data
	let city = $derived($page.data.city);
	let projects = $derived($page.data.recentProjects || []);

	// Format date helper function
	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-IN', options);
	};

	// Format business name from slug
	function formatBusinessName(slug: string | null) {
		if (!slug) return 'Unknown';
		return slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Get image URL
	function getImageUrl(cloudinaryId: string | null, imageUrl: string | null): string {
		if (cloudinaryId) {
			return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_200,q_auto,f_auto/${cloudinaryId}`;
		}
		return imageUrl || '';
	}
</script>

{#if projects.length > 0}
	<section style="gap: 2rem; display: flex; flex-direction: column;">
		<h2 style="font-size: var(--font-size-3xl); line-height: var(--font-size-3xl--line-height); font-weight: 700; text-align: center;">
			Recent Solar Panel Installation Projects in {city?.replace('-', ' ')}
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style="gap: 1.5rem;">
			{#each projects as project (project.id)}
				<Card.Root class="overflow-hidden card-interactive">
					<a
						href="/in/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
						class="block text-inherit no-underline"
					>
						<div class="bg-muted overflow-hidden" style="height: 12rem;">
							{#if project.cloudinary_public_id || project.image_url}
								<img
									src={getImageUrl(project.cloudinary_public_id, project.image_url)}
									alt={project.title}
									loading="lazy"
									style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-default);"
									class="hover:scale-105"
								/>
							{:else}
								<div class="flex items-center justify-center h-full text-muted-foreground">
									<ImageIcon size={32} />
								</div>
							{/if}
						</div>

						<Card.Content style="padding-top: 1.5rem; gap: 0.5rem; display: flex; flex-direction: column;">
							<h3 style="font-weight: 600; font-size: var(--font-size-lg); line-height: var(--font-size-lg--line-height);" class="line-clamp-2">{project.title}</h3>

							<div style="gap: 0.25rem; display: flex; flex-direction: column; font-size: var(--font-size-sm); line-height: var(--font-size-sm--line-height);" class="text-muted-foreground">
								<p class="flex items-center" style="gap: 0.5rem;">
									<MapPin size={14} class="flex-shrink-0" />
									<span>Pincode: {project.pincode}</span>
								</p>

								<p class="flex items-center" style="gap: 0.5rem;">
									<Calendar size={14} class="flex-shrink-0" />
									<span>{formatDate(project.project_date)}</span>
								</p>

								<p class="flex items-center" style="gap: 0.5rem;">
									<Wrench size={14} class="flex-shrink-0" />
									<span>
										Installer:
										<span class="text-accent-foreground" style="font-weight: 500; text-decoration: underline;">
											{formatBusinessName(project.business_slug)}
										</span>
									</span>
								</p>
							</div>
						</Card.Content>
					</a>
				</Card.Root>
			{/each}
		</div>

		{#if projects.length >= 6}
			<div class="bg-muted text-center" style="border-radius: var(--radius-lg); padding: 2rem; gap: 1rem; display: flex; flex-direction: column;">
				<p class="text-muted-foreground">Want to see more solar projects in your area?</p>
				<Button>View All Projects in {city?.replace('-', ' ')}</Button>
			</div>
		{/if}
	</section>
{/if}
