<script lang="ts">
	import { page } from '$app/stores';
	import AddReferrer from '$lib/in-new-rewrites/AddReferrer.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '$lib/components/ui/table';
	import { toast } from 'svelte-sonner';

	// Access page data
	let businessSlug = $derived($page.params.business_slug);
	let business = $derived($page.data.business);
	let referrers = $derived($page.data.referrers || []);

	// Modal state
	let showAddReferrer = $state(false);

	// Handle referrer added event
	function handleReferrerAdded() {
		showAddReferrer = false;
		window.location.reload();
	}

	// Function to get referrer link
	function getReferrerLink(referrerSlug) {
		return `https://solarvipani.com/in/solar-panel-installer/${businessSlug}/referrer/${referrerSlug}`;
	}

	// Function to copy link to clipboard
	function copyReferrerLink(referrerSlug) {
		const link = getReferrerLink(referrerSlug);
		navigator.clipboard.writeText(link).then(() => {
			toast.success('Link copied to clipboard!');
		}).catch(err => {
			console.error('Failed to copy link:', err);
			toast.error('Failed to copy link');
		});
	}

	// Function to delete referrer
	async function deleteReferrer(referrerId, referrerName) {
		if (!confirm(`Are you sure you want to delete referrer "${referrerName}"? This action cannot be undone.`)) {
			return;
		}

		try {
			const response = await fetch('/in/api/deleteReferrer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					referrerId: referrerId,
					businessId: business.id
				})
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Referrer deleted successfully!');
				window.location.reload();
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Error deleting referrer:', error);
			toast.error('An error occurred while deleting the referrer');
		}
	}
</script>

<svelte:head>
	<title>Referrers - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<div class="min-h-screen p-8 md:p-4 transition-colors duration-300 bg-background text-foreground">
	<header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
		<div>
			<h1 class="text-3xl font-bold mb-2">Referrers</h1>
			<p class="text-muted-foreground">Manage your business referrers and partners</p>
		</div>
		<Button onclick={() => (showAddReferrer = true)} class="whitespace-nowrap md:w-full">
			Add Referrer
		</Button>
	</header>

	<section>
		{#if referrers.length === 0}
			<div class="text-center py-12 bg-card rounded-lg border border-border">
				<p class="text-muted-foreground">No referrers found. Click "Add Referrer" to add your first referrer partner.</p>
			</div>
		{:else}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Slug</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Notes</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each referrers as referrer}
						<TableRow>
							<TableCell>
								<div class="font-semibold">{referrer.name}</div>
							</TableCell>
							<TableCell>
								<code class="bg-muted px-2 py-1 rounded text-sm font-mono">{referrer.slug}</code>
							</TableCell>
							<TableCell>{referrer.phone || 'N/A'}</TableCell>
							<TableCell>{referrer.email || 'N/A'}</TableCell>
							<TableCell>
								<div class="max-w-[300px] md:max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
									{referrer.notes || '-'}
								</div>
							</TableCell>
							<TableCell>
								<div class="flex gap-2 flex-wrap">
									<Button
										variant="outline"
										size="sm"
										class="bg-success hover:bg-success/90 text-success-foreground border-success"
										onclick={() => copyReferrerLink(referrer.slug)}
									>
										Copy
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onclick={() => deleteReferrer(referrer.id, referrer.name)}
									>
										Delete
									</Button>
								</div>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</section>
</div>

<!-- Add Referrer Modal -->
{#if showAddReferrer && business}
	<AddReferrer
		bind:show={showAddReferrer}
		businessId={business.id}
		onClose={() => (showAddReferrer = false)}
		onReferrerAdded={handleReferrerAdded}
	/>
{/if}
