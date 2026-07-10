<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import PostRecentProject from '$lib/us-new-rewrites/PostRecentProject.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	// Access page data
	const businessSlug = $page.params.business_slug;
	let projects = $derived($page.data.projects || []);
	let errorMessage = $derived($page.data.errorMessage);

	// State for post project modal
	let showAddProject = $state(false);

	// Handle project added event
	function handleProjectAdded() {
		showAddProject = false;
		window.location.reload();
	}

	// Format date for display
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// State for delete - track which project is being deleted
	let deletingProjectId = $state(null);

	// Handle project deletion
	async function handleDeleteProject(project: any) {
		if (deletingProjectId !== null) return;

		const confirmed = confirm(
			`Are you sure you want to hide "${project.title}"? This will remove it from public view.`
		);
		if (!confirmed) return;

		try {
			deletingProjectId = project.id;

			const response = await fetch('/us/api/updateRecentProject', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					projectId: project.id,
					business_slug: businessSlug
				})
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Project hidden successfully!');
				window.location.reload();
			} else {
				toast.error(result.error || 'Failed to hide project');
			}
		} catch (error) {
			console.error('Error hiding project:', error);
			toast.error('An error occurred while hiding the project');
		} finally {
			deletingProjectId = null;
		}
	}
</script>

<div>
	<header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
		<div>
			<h1 class="text-3xl font-bold mb-2">Your Projects</h1>
			<p class="text-muted-foreground">Showcase your solar panel installation projects</p>
		</div>
		<Button onclick={() => (showAddProject = true)} class="whitespace-nowrap w-full md:w-auto">
			Post Recent Project
		</Button>
	</header>

	<section>
		{#if errorMessage}
			<div
				class="bg-destructive-muted text-destructive p-4 rounded-md mb-4 text-center font-semibold"
			>
				{errorMessage}
			</div>
		{:else if projects.length === 0}
			<div class="text-center py-12 bg-card rounded-lg border border-border">
				<p class="text-muted-foreground">
					You haven't posted any projects yet. Click the "Post Recent Project" button above to add
					your first project!
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each projects as project}
					<div
						class="bg-card rounded-lg overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300"
					>
						{#if project.image_url}
							<div class="w-full h-[200px] overflow-hidden">
								<img
									src={project.image_url}
									alt={project.title}
									loading="lazy"
									class="w-full h-full object-cover"
								/>
							</div>
						{/if}
						<div class="p-6">
							<h3 class="text-xl font-semibold mb-4">{project.title}</h3>
							<div class="flex flex-wrap gap-3 mb-4">
								{#if project.pincode}
									<Badge variant="secondary" class="text-xs">{project.pincode}</Badge>
								{/if}
								{#if project.project_date}
									<Badge variant="secondary" class="text-xs">
										{formatDate(project.project_date)}
									</Badge>
								{/if}
							</div>
							<div class="flex gap-2">
								<Button
									variant="destructive"
									size="sm"
									class="w-full"
									onclick={() => handleDeleteProject(project)}
									disabled={deletingProjectId === project.id}
								>
									{deletingProjectId === project.id ? 'Deleting...' : 'Delete'}
								</Button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<!-- Post Recent Project Modal -->
{#if showAddProject}
	<PostRecentProject bind:show={showAddProject} {businessSlug} on:posted={handleProjectAdded} />
{/if}
