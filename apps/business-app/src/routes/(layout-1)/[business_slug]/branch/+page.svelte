<script lang="ts">
	import { page } from '$app/stores';
	import ShowEditProfile from '$lib/components/ShowEditProfile.svelte';
	import AddBranch from '$lib/components/AddBranch.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import DeleteButton from '$lib/components/DeleteButton.svelte';
	import ConfirmDeleteDialog from '$lib/components/ConfirmDeleteDialog.svelte';
	import { toast } from 'svelte-sonner';
	import { installerProfileUrl } from '$lib/mainAppUrls';

	// Access page data
	let businessSlug = $derived($page.params.business_slug ?? '');
	let mainBusiness = $derived($page.data.mainBusiness);
	let branches = $derived($page.data.branches || []);
	// Branch cards are titled by city (or name), so sort on the same value.
	let sortedBranches = $derived(
		[...branches].sort((a: any, b: any) =>
			(a.city || a.businessname || '').localeCompare(b.city || b.businessname || '')
		)
	);
	let errorMessage = $derived($page.data.errorMessage);
	// main-app still carries a [country] segment, so profile links below take
	// the business's resolved country rather than a literal. See $lib/mainAppUrls.
	let country = $derived($page.data.country ?? 'in');

	// State for edit modal (specific to this page)
	let showEditProfile = $state(false);
	let selectedBranch: any = $state(null);

	// State for add branch modal
	let showAddBranch = $state(false);

	// State for delete confirmation
	let showDeleteConfirm = $state(false);
	let branchToDelete: any = $state(null);
	let deleting = $state(false);

	async function deleteBranch() {
		if (!branchToDelete) return;
		deleting = true;
		try {
			const res = await fetch('/api/deleteBranch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ branchId: branchToDelete.id })
			});
			const data = await res.json();
			if (data.success) {
				showDeleteConfirm = false;
				branchToDelete = null;
				window.location.reload();
			} else {
				toast.error(data.error || 'Failed to delete branch');
			}
		} catch {
			toast.error('Failed to delete branch');
		} finally {
			deleting = false;
		}
	}

	// Function to open edit profile modal
	const openEditProfile = (branch: any) => {
		selectedBranch = branch;
		showEditProfile = true;
	};

	// Handle branch updated event
	function handleBranchUpdated() {
		window.location.reload();
	}

	// Handle branch added event
	function handleBranchAdded() {
		showAddBranch = false;
		window.location.reload();
	}

	// Format address for display
	function formatAddress(branch: any) {
		const parts = [];
		if (branch.address) parts.push(branch.address);
		if (branch.city) parts.push(branch.city);
		if (branch.district) parts.push(branch.district);
		if (branch.state) parts.push(branch.state);
		return parts.join(', ');
	}

	// Determine if a branch is the main branch
	function isMainBranch(branch: any) {
		return mainBusiness && branch.id === mainBusiness.id;
	}
</script>

<div>
	<header class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Locations</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage your business branches across different locations</p>
		</div>
		<Button onclick={() => (showAddBranch = true)} class="whitespace-nowrap w-full md:w-auto">
			Add Branch
		</Button>
	</header>

	<!-- Branches Section -->
	<section>
		{#if errorMessage}
			<div
				class="bg-destructive-muted text-destructive p-4 rounded-md mb-4 text-center font-semibold"
			>
				{errorMessage}
			</div>
		{:else}
			<!-- Main Office -->
			{#if mainBusiness}
				<h2 class="text-sm font-medium text-muted-foreground mb-3">Main Office</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
					<div
						class="bg-card rounded-lg p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col gap-4"
					>
						<div class="flex justify-between items-start gap-4 mb-2">
							<h2 class="text-base font-semibold flex-1">{mainBusiness.businessname}</h2>
							<Badge variant="outline" class="bg-success-muted text-success border-transparent">Main Office</Badge>
						</div>
						<div class="flex-1 space-y-3 text-sm">
							<div>
								<p class="text-muted-foreground">Address</p>
								<p class="font-medium">{formatAddress(mainBusiness)}</p>
							</div>
							{#if mainBusiness.phonenumber}
								<div>
									<p class="text-muted-foreground">Phone</p>
									<p class="font-medium">{mainBusiness.phonenumber}</p>
								</div>
							{/if}
							{#if mainBusiness.email}
								<div>
									<p class="text-muted-foreground">Email</p>
									<p class="font-medium break-all">{mainBusiness.email}</p>
								</div>
							{/if}
						</div>
						<div class="mt-auto flex gap-2 pt-2">
							<Button
								href={installerProfileUrl(country, mainBusiness.slug)}
								target="_blank"
								variant="default"
								class="flex-1"
							>
								Profile Page
							</Button>
							<Button
								variant="outline"
								class="flex-1"
								onclick={() => openEditProfile(mainBusiness)}
							>
								Edit Details
							</Button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Branch Offices -->
			<h2 class="text-sm font-medium text-muted-foreground mb-3">Branch Offices</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				{#each sortedBranches as branch}
					{#if !isMainBranch(branch)}
						<div
							class="bg-card rounded-lg p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col gap-4"
						>
							<div class="flex justify-between items-start gap-4 mb-2">
								<h2 class="text-base font-semibold flex-1">{branch.city || branch.businessname}</h2>
								<Badge variant="outline" class="bg-accent-muted text-accent-strong border-transparent">Branch Office</Badge>
							</div>
							<div class="flex-1 space-y-3 text-sm">
								<div>
									<p class="text-muted-foreground">Address</p>
									<p class="font-medium">{formatAddress(branch)}</p>
								</div>
								{#if branch.phonenumber}
									<div>
										<p class="text-muted-foreground">Phone</p>
										<p class="font-medium">{branch.phonenumber}</p>
									</div>
								{/if}
								{#if branch.email}
									<div>
										<p class="text-muted-foreground">Email</p>
										<p class="font-medium break-all">{branch.email}</p>
									</div>
								{/if}
							</div>
							<div class="mt-auto flex gap-2 pt-2">
								<Button
									href={installerProfileUrl(country, branch.slug)}
									target="_blank"
									variant="default"
									class="flex-1"
								>
									Profile Page
								</Button>
								<Button
									variant="outline"
									class="flex-1"
									onclick={() => openEditProfile(branch)}
								>
									Edit Details
								</Button>
								<DeleteButton
									label="Delete branch"
									onclick={() => {
										branchToDelete = branch;
										showDeleteConfirm = true;
									}}
								/>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}

		<!-- No branches message -->
		{#if branches.length === 0 && !errorMessage && mainBusiness}
			<div class="text-center py-12 bg-card rounded-lg border border-border">
				<p class="text-muted-foreground">You don't have any branch offices yet.</p>
			</div>
		{/if}
	</section>
</div>

<!-- Edit Profile Modal (specific to this page) -->
{#if showEditProfile && selectedBranch}
	<ShowEditProfile
		bind:show={showEditProfile}
		businessInfo={selectedBranch}
		businessSlug={selectedBranch.slug}
		onClose={() => (showEditProfile = false)}
		onUpdated={handleBranchUpdated}
	/>
{/if}

<!-- Add Branch Modal -->
{#if showAddBranch && mainBusiness}
	<AddBranch
		bind:show={showAddBranch}
		businessId={mainBusiness.id}
		{businessSlug}
		{country}
		onClose={() => (showAddBranch = false)}
		onBranchAdded={handleBranchAdded}
	/>
{/if}

<!-- Delete Confirmation Dialog -->
<ConfirmDeleteDialog
	bind:open={showDeleteConfirm}
	title="Delete branch?"
	loading={deleting}
	onConfirm={deleteBranch}
	onCancel={() => (branchToDelete = null)}
>
	Delete the <strong>{branchToDelete?.city}</strong> branch?
</ConfirmDeleteDialog>
