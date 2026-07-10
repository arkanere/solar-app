<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import {
		Table,
		TableBody,
		TableHead,
		TableHeader,
		TableRow,
		TableCell
	} from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	const businessSlug = $page.params.business_slug;
	let leads = $derived($page.data.leads || []);

	// Function to calculate days ago
	function getDaysAgo(dateString: string) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now.getTime() - date.getTime();
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
	function showInquiryInstructions(lead: any) {
		toast.info(`How to get inquiry in ${lead.county}`, {
			description: `1. Add a branch in any city within ${lead.county} county\n2. Once added, the lead will appear in your dashboard home page\n3. Click "Add Branch" in the navigation menu to get started`,
			duration: 10000
		});
	}
</script>

<svelte:head>
	<title>Open Inquiries - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<div>
	<header class="text-center mb-8">
		<h1 class="text-2xl md:text-3xl font-semibold mb-2 text-accent">Open Inquiries</h1>
		<p class="text-base text-foreground-secondary">
			Available inquiries that you can claim for free
		</p>
	</header>

	{#if leads.length > 0}
		<div class="rounded-lg border border-border bg-card shadow-card overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead class="w-[60px]">Sr No.</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>County</TableHead>
						<TableHead>State</TableHead>
						<TableHead>Received</TableHead>
						<TableHead class="text-center">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each leads as lead, index}
						<TableRow>
							<TableCell>{index + 1}</TableCell>
							<TableCell>
								<div class="flex flex-col gap-1">
									<span class="font-semibold text-accent">{lead.name}</span>
									{#if lead.sv_comment_for_businesses}
										<span
											class="text-xs italic text-foreground-secondary border-l-2 border-accent bg-accent/5 px-2 py-1 rounded"
										>
											📝 {lead.sv_comment_for_businesses}
										</span>
									{/if}
								</div>
							</TableCell>
							<TableCell>{lead.county}</TableCell>
							<TableCell>{lead.state}</TableCell>
							<TableCell class="whitespace-nowrap">
								<Badge variant="secondary">{getDaysAgo(lead.created_at)}</Badge>
							</TableCell>
							<TableCell class="text-center">
								<Button
									class="bg-success hover:bg-success/90 text-success-foreground"
									onclick={() => showInquiryInstructions(lead)}
								>
									Get this Inquiry
								</Button>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	{:else}
		<div class="flex justify-center items-center min-h-[40vh]">
			<div
				class="bg-card rounded-lg border border-border shadow-card p-12 md:p-8 text-center max-w-xl w-full"
			>
				<h2 class="text-2xl font-semibold mb-6 text-accent">🔍 No Open Inquiries Available</h2>
				<p class="text-foreground-secondary mb-4 leading-relaxed">
					There are currently no inquiries available to claim. New inquiries will appear here as
					they become available.
				</p>
				<p class="text-foreground-secondary leading-relaxed">
					Check back later or visit your
					<a href="/us/{businessSlug}/crm" class="text-accent font-semibold hover:underline">
						CRM section
					</a> to manage your existing leads.
				</p>
			</div>
		</div>
	{/if}
</div>
