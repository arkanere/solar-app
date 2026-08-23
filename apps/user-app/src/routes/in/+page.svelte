<script lang="ts">
	import BillUpload from '$lib/components/BillUpload.svelte';
	import AppShell from '$lib/components/ui/AppShell.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge, { type BadgeVariant } from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type ClaimedBusiness = PageData['claimedBusinesses'][number];

	function formatDate(dateString: Date | string | null) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleString('en-IN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStageLabel(stage: number | null) {
		const stages: Record<number, string> = {
			0: 'New Inquiry',
			1: 'Qualified',
			2: 'Proposal Sent',
			3: 'Won'
		};
		return (stage != null && stages[stage]) || 'Under Review';
	}

	// Stage colours follow the status-badge rule: a muted surface with the
	// saturated colour as text, never a solid fill.
	function getStageVariant(stage: number | null): BadgeVariant {
		const variants: Record<number, BadgeVariant> = {
			0: 'neutral',
			1: 'accent',
			2: 'warning',
			3: 'success'
		};
		return (stage != null && variants[stage]) || 'outline';
	}

	function groupClaimsByLead(claimedBusinesses: ClaimedBusiness[]) {
		const grouped = new Map<number, ClaimedBusiness[]>();
		claimedBusinesses.forEach((claim) => {
			const key = claim.originalLeadId;
			if (!grouped.has(key)) grouped.set(key, []);
			grouped.get(key)!.push(claim);
		});
		return grouped;
	}

	const claimsGroupedByLead = $derived(groupClaimsByLead(data.claimedBusinesses || []));
</script>

<svelte:head>
	<title>Dashboard - User App</title>
	<meta name="description" content="User Dashboard" />
</svelte:head>

{#if !data.user}
	<AppShell maxWidth="3xl">
		<div class="mx-auto max-w-md py-8">
			<Card class="p-6">
				<h1 class="text-2xl font-semibold text-foreground">Track Your Solar Inquiry</h1>
				<p class="mt-3 text-sm text-foreground-secondary">
					To view your inquiry status and installer interest, please use the sign-in link sent to
					you by email from Solar Vipani.
				</p>
				<p class="mt-3 text-sm text-muted-foreground">
					The link is sent automatically when an installer expresses interest in your inquiry.
					Check your inbox for an email from <strong class="font-medium text-foreground"
						>Solar Vipani</strong
					>.
				</p>
			</Card>
		</div>
	</AppShell>
{:else}
	<AppShell user={data.user} maxWidth="5xl">
		<header class="mb-6">
			<h1 class="text-2xl font-semibold text-foreground">
				{data.leads && data.leads.length > 1 ? 'Your Solar Inquiries' : 'Your Solar Inquiry'}
			</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				{#if data.leads && data.leads.length > 1}
					You have submitted {data.leads.length} solar inquiries. We will contact you soon with quotations
					from verified installers.
				{:else}
					We have received your solar inquiry. Our team will contact you soon with quotations from
					verified installers.
				{/if}
			</p>
		</header>

		<div class="space-y-10">
			<section class="space-y-4">
				{#if data.leads && data.leads.length > 0}
					{#each data.leads as lead (lead.id)}
						<Card class="p-5 md:p-6">
							<div class="mb-4 flex items-center justify-between gap-3 border-b border-border pb-4">
								<h2 class="text-base font-semibold text-foreground">Inquiry details</h2>
								<span class="text-sm text-muted-foreground"
									>Submitted {formatDate(lead.submittedAt)}</span
								>
							</div>

							<div class="grid gap-4 md:grid-cols-2">
								<Field label="Name" value={lead.name} />
								<Field label="Phone" value={lead.phone} />
								<Field label="Email" value={lead.email || 'Not provided'} />
								<Field
									label="Location"
									value={`${lead.pinCode}${lead.district ? `, ${lead.district}` : ''}`}
								/>
								<Field label="Installation Type" value={lead.type} />
								<Field label="Requirements" value={lead.comment} class="md:col-span-2" />
							</div>

							<div class="mt-6 border-t border-border pt-6">
								<BillUpload leadId={lead.id} billUrl={lead.billUrl} billFormat={lead.billFormat} />
							</div>
						</Card>
					{/each}
				{:else}
					<EmptyState title="You haven't submitted any solar inquiries yet.">
						Ready to go solar? Submit your requirements and get quotes from verified installers.
					</EmptyState>
				{/if}
			</section>

			<section>
				<h2 class="mb-4 text-lg font-semibold text-foreground">Interest Received</h2>

				{#if data.claimedBusinesses && data.claimedBusinesses.length > 0}
					<p class="mb-4 text-sm text-muted-foreground">
						{#if data.claimedBusinesses.length === 1}
							1 installer has shown interest in your inquiry.
						{:else}
							{data.claimedBusinesses.length} installers have shown interest in your inquiries.
						{/if}
					</p>

					<div class="space-y-6">
						{#each data.leads as lead (lead.id)}
							{@const claimsForLead = claimsGroupedByLead.get(lead.id) || []}
							{#if claimsForLead.length > 0}
								<div>
									<div class="mb-3 flex flex-wrap items-center gap-3">
										<h3 class="text-base font-semibold text-foreground">
											For your inquiry submitted on {formatDate(lead.submittedAt)}
										</h3>
										<Badge variant="accent">
											{claimsForLead.length}
											{claimsForLead.length === 1 ? 'installer' : 'installers'} interested
										</Badge>
									</div>

									<div class="grid gap-4 md:grid-cols-2">
										{#each claimsForLead as claim}
											<Card class="flex flex-col p-5">
												<div class="flex items-start justify-between gap-3">
													<div class="min-w-0">
														<h4 class="text-base font-semibold text-foreground">
															{claim.businessName}
														</h4>
														<p class="mt-0.5 text-sm text-muted-foreground">
															{claim.businessDistrict}, {claim.businessState}
														</p>
													</div>
													<Badge variant={getStageVariant(claim.stage)}>
														{getStageLabel(claim.stage)}
													</Badge>
												</div>

												<div class="mt-4 space-y-3">
													<Field label="Interested on" value={formatDate(claim.interestReceivedAt)} />
													{#if claim.businessPhone}
														<Field label="Contact">
															<a
																href="tel:{claim.businessPhone}"
																class="text-primary-strong hover:underline"
															>
																{claim.businessPhone}
															</a>
														</Field>
													{/if}
												</div>

												{#if claim.businessSlug}
													<div class="mt-auto flex gap-2 pt-4">
														<Button
															href="/solar-panel-installer/{claim.businessSlug}"
															variant="outline"
															size="sm"
															target="_blank"
															rel="noopener"
															class="w-full"
														>
															View Installer Profile
														</Button>
													</div>
												{/if}
											</Card>
										{/each}
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{:else}
					<EmptyState title="No installers have shown interest yet.">
						We're matching your inquiry with qualified installers in your area.
					</EmptyState>
				{/if}
			</section>
		</div>
	</AppShell>
{/if}
