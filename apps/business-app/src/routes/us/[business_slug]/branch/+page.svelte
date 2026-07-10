<script lang="ts">
	import { page } from '$app/stores';
	import ShowEditProfile from '$lib/us-new-rewrites/ShowEditProfile.svelte';
	import AddBranch from '$lib/us-new-rewrites/AddBranch.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	// Access page data
	let businessSlug = $derived($page.params.business_slug ?? '');
	let mainBusiness = $derived($page.data.mainBusiness);
	let branches = $derived($page.data.branches || []);
	let errorMessage = $derived($page.data.errorMessage);

	// State for edit modal (specific to this page)
	let showEditProfile = $state(false);
	let selectedBranch: any = $state(null);

	// State for add branch modal
	let showAddBranch = $state(false);

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
		if (branch.county) parts.push(branch.county);
		if (branch.state) parts.push(branch.state);
		return parts.join(', ');
	}

	// Determine if a branch is the main branch
	function isMainBranch(branch: any) {
		return mainBusiness && branch.id === mainBusiness.id;
	}
</script>

<div>
	<header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
		<div>
			<h1 class="text-3xl font-bold mb-2">Branch Offices</h1>
			<p class="text-muted-foreground">Manage your business branches across different locations</p>
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
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<!-- Main Branch Tile -->
				{#if mainBusiness}
					<div
						class="bg-card rounded-lg p-6 border-2 border-success shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col gap-4"
					>
						<div class="flex justify-between items-start gap-4 mb-2">
							<h2 class="text-xl font-semibold flex-1">{mainBusiness.businessname}</h2>
							<Badge class="bg-success text-success-foreground">Main Office</Badge>
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
						<div class="flex gap-3 flex-wrap md:flex-col">
							<Button
								href="https://solarvipani.com/us/solar-panel-installer/{mainBusiness.slug}"
								target="_blank"
								variant="default"
								class="flex-1 min-w-[120px]"
							>
								Profile Page
							</Button>
							<Button
								variant="outline"
								class="flex-1 min-w-[120px]"
								onclick={() => openEditProfile(mainBusiness)}
							>
								Edit Details
							</Button>
						</div>
					</div>
				{/if}

				<!-- Branch Offices Tiles -->
				{#each branches as branch}
					{#if !isMainBranch(branch)}
						<div
							class="bg-card rounded-lg p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col gap-4"
						>
							<div class="flex justify-between items-start gap-4 mb-2">
								<h2 class="text-xl font-semibold flex-1">{branch.city || branch.businessname}</h2>
								<Badge class="bg-accent text-accent-foreground">Branch Office</Badge>
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
							<div class="flex gap-3 flex-wrap md:flex-col">
								<Button
									href="https://solarvipani.com/us/solar-panel-installer/{branch.slug}"
									target="_blank"
									variant="default"
									class="flex-1 min-w-[120px]"
								>
									Profile Page
								</Button>
								<Button
									variant="outline"
									class="flex-1 min-w-[120px]"
									onclick={() => openEditProfile(branch)}
								>
									Edit Details
								</Button>
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
		onClose={() => (showAddBranch = false)}
		onBranchAdded={handleBranchAdded}
	/>
{/if}
