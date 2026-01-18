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
	<section class="space-y-8">
		<h2 class="text-3xl font-bold text-center">
			Recent Solar Panel Installation Projects in {city?.replace('-', ' ')}
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each projects as project (project.id)}
				<Card.Root class="overflow-hidden hover:shadow-lg transition-shadow duration-200">
					<a
						href="/in/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
						class="block text-inherit no-underline"
					>
						<div class="h-48 bg-muted overflow-hidden">
							{#if project.cloudinary_public_id || project.image_url}
								<img
									src={getImageUrl(project.cloudinary_public_id, project.image_url)}
									alt={project.title}
									loading="lazy"
									class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
								/>
							{:else}
								<div class="flex items-center justify-center h-full text-muted-foreground">
									<ImageIcon size={32} />
								</div>
							{/if}
						</div>

						<Card.Content class="pt-6 space-y-2">
							<h3 class="font-semibold text-lg line-clamp-2">{project.title}</h3>

							<div class="space-y-1 text-sm text-muted-foreground">
								<p class="flex items-center gap-2">
									<MapPin size={14} class="flex-shrink-0" />
									<span>Pincode: {project.pincode}</span>
								</p>

								<p class="flex items-center gap-2">
									<Calendar size={14} class="flex-shrink-0" />
									<span>{formatDate(project.project_date)}</span>
								</p>

								<p class="flex items-center gap-2">
									<Wrench size={14} class="flex-shrink-0" />
									<span>
										Installer:
										<span class="text-accent-foreground font-medium underline">
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
			<div class="bg-muted rounded-lg p-8 text-center space-y-4">
				<p class="text-muted-foreground">Want to see more solar projects in your area?</p>
				<Button>View All Projects in {city?.replace('-', ' ')}</Button>
			</div>
		{/if}
	</section>
{/if}
