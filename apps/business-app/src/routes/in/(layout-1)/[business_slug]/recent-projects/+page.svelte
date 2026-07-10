<script lang="ts">
	import { page } from '$app/stores';
	import PostRecentProject from '$lib/in-new-rewrites/PostRecentProject.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { toast } from 'svelte-sonner';

	// Access page data
	let businessSlug = $derived($page.params.business_slug ?? '');
	let projects = $derived($page.data.projects || []);
	let errorMessage = $derived($page.data.errorMessage);

	// Format date for display
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// State for delete - track which project is being deleted
	let deletingProjectId = $state(null);

	// State for post project modal
	let showPostRecentProject = $state(false);

	// Handle project posted
	function handleProjectPosted() {
		showPostRecentProject = false;
		window.location.reload();
	}

	// Handle project deletion
	async function handleDeleteProject(project: any) {
		if (deletingProjectId !== null) return;

		const confirmed = confirm(
			`Are you sure you want to delete "${project.title}"? This action cannot be undone.`
		);
		if (!confirmed) return;

		try {
			deletingProjectId = project.id;

			const response = await fetch('/in/api/deleteRecentProject', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					projectId: project.id,
					business_slug: businessSlug
				})
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Project deleted successfully');
				window.location.reload();
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Delete Project Error:', error);
			toast.error('An error occurred while deleting the project');
		} finally {
			deletingProjectId = null;
		}
	}
</script>

<div>
	<header class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Project Portfolio</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage your completed solar installation projects</p>
		</div>
		<Button onclick={() => (showPostRecentProject = true)} class="whitespace-nowrap w-full md:w-auto">
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
				<p class="text-muted-foreground">You haven't posted any projects yet. Click the "Post Recent Project" button above to add your first project!</p>
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
									class="w-full h-full object-cover"
								/>
							</div>
						{/if}
						<div class="p-6">
							<h3 class="text-xl font-semibold mb-2">{project.title}</h3>
							{#if project.description}
								<p class="text-sm text-foreground-secondary mb-4 leading-relaxed">
									{project.description}
								</p>
							{/if}
							<div class="flex flex-wrap gap-3 mb-4">
								{#if project.capacity}
									<Badge variant="secondary" class="text-xs">{project.capacity} kW</Badge>
								{/if}
								{#if project.location}
									<Badge variant="secondary" class="text-xs">{project.location}</Badge>
								{/if}
								{#if project.installation_date}
									<Badge variant="secondary" class="text-xs"
										>{formatDate(project.installation_date)}</Badge
									>
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
									{deletingProjectId === project.id ? 'Deleting...' : 'Delete Project'}
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
{#if showPostRecentProject}
	<PostRecentProject
		bind:show={showPostRecentProject}
		{businessSlug}
		onClose={() => (showPostRecentProject = false)}
		onPosted={handleProjectPosted}
	/>
{/if}
