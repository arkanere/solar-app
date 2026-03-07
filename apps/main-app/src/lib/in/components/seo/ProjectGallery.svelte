<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import { formatDate, formatBusinessName } from '$lib/constants/projectFormatters';

	interface Project {
		id: number;
		business_slug: string;
		project_slug: string;
		title: string;
		pincode?: string;
		project_date?: string;
		image_url?: string;
		cloudinary_public_id?: string;
	}

	interface Props {
		projects: Project[];
		locationName: string;
	}

	const { projects, locationName }: Props = $props();

	function getImageUrl(cloudinaryId: string | null, imageUrl: string | null): string {
		if (cloudinaryId) {
			return `https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300,q_auto,f_auto/${cloudinaryId}`;
		}
		return imageUrl || '';
	}
</script>

{#if projects.length > 0}
	<section class="mb-8">
		<h2 class="text-center text-primary text-3xl font-semibold mb-6">
			Recent Solar Installations in {locationName}
		</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			{#each projects as project (project.id)}
				<a
					href="/in/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
					rel="noopener"
					class="group"
				>
					<Card.Root class="overflow-hidden h-full hover:shadow-md transition-shadow">
						<div class="aspect-square overflow-hidden">
							{#if project.cloudinary_public_id}
								<img
									src={getImageUrl(project.cloudinary_public_id, null)}
									alt="{project.title} - Solar installation in {locationName}"
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									loading="lazy"
								/>
							{:else if project.image_url}
								<img
									src={project.image_url}
									alt="{project.title} - Solar installation in {locationName}"
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
								<p>Pincode: {project.pincode || 'N/A'}</p>
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
	</section>
{/if}
