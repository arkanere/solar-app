<script>
	import { page } from '$app/stores';
	import PostRecentProject from '$lib/in/PostRecentProject.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { EmptyState } from '$lib/components/ui/empty-state';
	import { PageHeader } from '$lib/components/ui/page-header';
	import { toast } from 'svelte-sonner';

	// Access page data
	let businessSlug = $derived($page.params.business_slug);
	let mainBusiness = $derived($page.data.mainBusiness);
	let projects = $derived($page.data.projects || []);
	let errorMessage = $derived($page.data.errorMessage);

	// Format date for display
	function formatDate(dateString) {
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
	function handleProjectPosted(event) {
		showPostRecentProject = false;
		window.location.reload();
	}

	// Handle project deletion
	async function handleDeleteProject(project) {
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

<div class="min-h-screen p-8 md:p-4 transition-colors duration-300 bg-background text-foreground">
	<PageHeader
		title="Project Portfolio"
		description="Manage your completed solar installation projects"
	>
		<Button onclick={() => (showPostRecentProject = true)} class="whitespace-nowrap md:w-full">
			Post Recent Project
		</Button>
	</PageHeader>

	<section>
		{#if errorMessage}
			<div class="bg-destructive-muted text-destructive p-4 rounded-md mb-4 text-center font-semibold">
				{errorMessage}
			</div>
		{:else if projects.length === 0}
			<EmptyState
				title="You haven't posted any projects yet."
				description="Click the &quot;Post Recent Project&quot; button above to add your first project!"
			/>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each projects as project}
					<div class="bg-card rounded-lg overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300">
						{#if project.image_url}
							<div class="w-full h-[200px] overflow-hidden">
								<img src={project.image_url} alt={project.title} class="w-full h-full object-cover" />
							</div>
						{/if}
						<div class="p-6">
							<h3 class="text-xl font-semibold mb-2">{project.title}</h3>
							{#if project.description}
								<p class="text-sm text-foreground-secondary mb-4 leading-relaxed">{project.description}</p>
							{/if}
							<div class="flex flex-wrap gap-3 mb-4">
								{#if project.capacity}
									<Badge variant="secondary" class="text-xs">{project.capacity} kW</Badge>
								{/if}
								{#if project.location}
									<Badge variant="secondary" class="text-xs">{project.location}</Badge>
								{/if}
								{#if project.installation_date}
									<Badge variant="secondary" class="text-xs">{formatDate(project.installation_date)}</Badge>
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
