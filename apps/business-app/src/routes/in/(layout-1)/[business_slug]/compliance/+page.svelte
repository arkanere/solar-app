<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { PolicyAcceptanceModal } from '$lib/compliance';

	let policy = $derived($page.data.policy);
	let status = $derived($page.data.status);
	let history = $derived($page.data.history || []);
	let errorMessage = $derived($page.data.errorMessage);

	let showRenewModal = $state(false);
	let isAccepting = $state(false);

	async function renewAcceptance() {
		isAccepting = true;
		try {
			const res = await fetch('/in/api/compliance/acceptPolicy', { method: 'POST' });
			const data = await res.json();
			if (data.success) {
				showRenewModal = false;
				window.location.reload();
			} else {
				alert(data.error || 'Failed to record acceptance');
			}
		} catch {
			alert('Failed to record acceptance');
		} finally {
			isAccepting = false;
		}
	}

	function formatDate(iso: string | null | undefined) {
		if (!iso) return '—';
		return new Date(iso).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatDateTime(iso: string) {
		return new Date(iso).toLocaleString('en-IN', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	const stateLabels: Record<string, string> = {
		compliant: 'Compliant',
		expiring: 'Expiring Soon',
		expired: 'Action Required'
	};

	const stateBadgeClasses: Record<string, string> = {
		compliant: 'bg-success text-success-foreground',
		expiring: 'bg-warning text-warning-foreground',
		expired: 'bg-destructive text-destructive-foreground'
	};
</script>

<div>
	<header class="mb-8">
		<h1 class="text-3xl font-bold mb-2">Compliance</h1>
		<p class="text-muted-foreground">
			Your data-handling agreements for customer leads, kept on record under India's DPDP Act 2023
		</p>
	</header>

	{#if errorMessage}
		<div class="bg-destructive-muted text-destructive p-4 rounded-md mb-4 text-center font-semibold">
			{errorMessage}
		</div>
	{:else}
		<!-- Current status -->
		<section class="mb-8">
			<div class="bg-card rounded-lg p-6 border shadow-card flex flex-col gap-4">
				<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div class="flex items-center gap-3">
						<h2 class="text-xl font-semibold">Data Handling Agreement</h2>
						{#if status}
							<Badge class={stateBadgeClasses[status.state]}>{stateLabels[status.state]}</Badge>
						{/if}
					</div>
					{#if policy}
						<Button onclick={() => (showRenewModal = true)} class="whitespace-nowrap w-full md:w-auto">
							{status?.state === 'expired' ? 'Accept Agreement' : 'Renew Acceptance'}
						</Button>
					{/if}
				</div>

				{#if !policy}
					<p class="text-sm text-muted-foreground">
						No active data-handling policy is published yet. Nothing to accept right now.
					</p>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div>
							<p class="text-muted-foreground">Current policy version</p>
							<p class="font-medium">{policy.version}</p>
						</div>
						<div>
							<p class="text-muted-foreground">Last accepted</p>
							<p class="font-medium">{formatDate(status?.acceptedAt)}</p>
						</div>
						<div>
							<p class="text-muted-foreground">Valid until</p>
							<p class="font-medium">{formatDate(status?.expiresAt)}</p>
						</div>
					</div>
					<div>
						<p class="text-sm text-muted-foreground mb-1">What you agree to</p>
						<p class="text-sm leading-relaxed">{policy.summary}</p>
					</div>
				{/if}
			</div>
		</section>

		<!-- Acceptance history -->
		<section>
			<h2 class="text-xl font-semibold mb-4">Acceptance History</h2>
			{#if history.length === 0}
				<div class="bg-card rounded-lg p-6 border shadow-card text-center text-muted-foreground">
					No acceptances recorded yet. You will be asked to accept the agreement when you claim
					your first lead, or you can accept it now.
				</div>
			{:else}
				<div class="flex flex-col gap-4">
					{#each history as record (record.id)}
						<div class="bg-card rounded-lg p-6 border shadow-card">
							<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
								<p class="font-medium">Accepted on {formatDateTime(record.acceptedAt)}</p>
								<Badge variant="outline">Version {record.policyVersion}</Badge>
							</div>
							<p class="text-sm leading-relaxed text-muted-foreground">{record.policySummary}</p>
						</div>
					{/each}
				</div>
			{/if}
			<p class="text-xs text-muted-foreground mt-4">
				Each acceptance is retained with its timestamp and IP address for audit purposes under
				India's DPDP Act 2023.
			</p>
		</section>
	{/if}
</div>

<PolicyAcceptanceModal
	bind:open={showRenewModal}
	summary={policy?.summary ?? ''}
	{isAccepting}
	agreeLabel="I Agree — Renew Acceptance"
	onAgree={renewAcceptance}
/>
