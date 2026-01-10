<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { toast } from 'svelte-sonner';

	let businessSlug = $derived($page.params.business_slug);
	let leads = $derived($page.data.leads || []);
	let business = $derived($page.data.business);

	// Function to calculate days ago
	function getDaysAgo(dateString) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now - date;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			return 'Today';
		} else if (diffInDays === 1) {
			return '1 day ago';
		} else {
			return `${diffInDays} days ago`;
		}
	}

	// Function to show instructions for getting the inquiry
	function showInquiryInstructions(lead) {
		toast.info(`How to get inquiry in ${lead.district}`, {
			description: `1. Add a branch in any city within ${lead.district} district\n2. Once added, the lead will appear in your dashboard home page\n3. Click "Add Branch" in the sidebar to get started`,
			duration: 10000
		});
	}
</script>

<svelte:head>
	<title>Open Inquiries - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<div class="min-h-screen p-8 md:p-4 transition-colors duration-300 bg-background text-foreground">
	<header class="mb-8 flex flex-col justify-center items-center text-center">
		<div>
			<h1 class="text-3xl font-bold mb-2">Open Inquiries</h1>
			<p class="text-muted-foreground">Browse available customer inquiries in different districts</p>
		</div>
	</header>

	<section>
		{#if leads.length === 0}
			<div class="text-center py-12 bg-card rounded-lg border border-border">
				<p class="text-muted-foreground">No open inquiries available at the moment. Check back later for new opportunities!</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each leads as lead}
					<div
						class="bg-card rounded-lg p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300"
					>
						<div class="flex justify-between items-center mb-4 gap-2 flex-wrap">
							<Badge class="bg-accent text-accent-foreground">{lead.district}, {lead.state}</Badge>
							<Badge variant="secondary" class="text-xs">{getDaysAgo(lead.created_at)}</Badge>
						</div>
						<div class="mb-4 space-y-2">
							{#if lead.pin_code}
								<div class="flex text-sm">
									<span class="font-semibold min-w-[80px]">Pin Code:</span>
									<span class="text-foreground-secondary">{lead.pin_code}</span>
								</div>
							{/if}
							{#if lead.comment}
								<div class="flex flex-col text-sm">
									<span class="font-semibold">Comment:</span>
									<span class="text-foreground-secondary">{lead.comment}</span>
								</div>
							{/if}
							{#if lead.sv_comment_for_businesses}
								<div class="flex flex-col text-sm">
									<span class="font-semibold">SV Note:</span>
									<span class="text-foreground-secondary">{lead.sv_comment_for_businesses}</span>
								</div>
							{/if}
						</div>
						<div class="flex gap-2">
							<Button
								variant="secondary"
								class="w-full"
								onclick={() => showInquiryInstructions(lead)}
							>
								How to Get This Inquiry
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
