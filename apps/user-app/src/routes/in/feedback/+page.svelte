<script lang="ts">
	import { enhance } from '$app/forms';
	import AppShell from '$lib/components/ui/AppShell.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	/** Radio groups are '' when there is no saved answer yet. */
	function toYesNo(value: boolean | null | undefined): string {
		return value == null ? '' : value ? 'yes' : 'no';
	}

	// These four are editable form fields seeded from the server, so they cannot
	// be `$derived` — a derived value cannot be assigned. Seeding them in
	// `$state` keeps the SSR'd HTML showing the saved feedback; the `$effect`
	// below re-seeds them when `data.feedback` changes, which is what the plain
	// initializers did not do (they captured only the first value).
	// svelte-ignore state_referenced_locally
	let gotCallback = $state(toYesNo(data.feedback?.gotCallback));
	// svelte-ignore state_referenced_locally
	let gotQuotation = $state(toYesNo(data.feedback?.gotQuotation));
	// svelte-ignore state_referenced_locally
	let rating = $state(data.feedback?.recommendationRating || 0);
	let hoverRating = $state(0);
	// svelte-ignore state_referenced_locally
	let suggestions = $state(data.feedback?.suggestions || '');
	let submitting = $state(false);

	$effect(() => {
		const feedback = data.feedback;
		gotCallback = toYesNo(feedback?.gotCallback);
		gotQuotation = toYesNo(feedback?.gotQuotation);
		rating = feedback?.recommendationRating || 0;
		suggestions = feedback?.suggestions || '';
	});

	const ratingLabels: Record<number, string> = {
		1: 'Not at all',
		2: 'Unlikely',
		3: 'Maybe',
		4: 'Likely',
		5: 'Very high'
	};
</script>

<svelte:head>
	<title>Share Your Feedback - Solar Vipani</title>
	<meta name="description" content="Share your experience with Solar Vipani" />
</svelte:head>

{#if !data.user}
	<AppShell maxWidth="3xl">
		<div class="mx-auto max-w-md py-8">
			<Card class="p-6">
				<h1 class="text-2xl font-semibold text-foreground">Share Your Feedback</h1>
				<p class="mt-3 text-sm text-foreground-secondary">
					To share your feedback, please use the sign-in link sent to you by email from Solar
					Vipani.
				</p>
				<p class="mt-3 text-sm text-muted-foreground">
					Check your inbox for an email from <strong class="font-medium text-foreground"
						>Solar Vipani</strong
					>.
				</p>
			</Card>
		</div>
	</AppShell>
{:else if form?.success}
	<AppShell user={data.user} maxWidth="3xl">
		<div class="mx-auto max-w-md py-8">
			<Card class="p-6">
				<h1 class="text-2xl font-semibold text-foreground">Thank you! 🙏</h1>
				<p class="mt-3 text-sm text-foreground-secondary">
					Your feedback has been recorded. It directly shapes what we build next and helps other
					homeowners go solar with confidence.
				</p>
				<div class="mt-6">
					<Button href="/in" variant="outline" size="sm">Back to dashboard</Button>
				</div>
			</Card>
		</div>
	</AppShell>
{:else}
	<AppShell user={data.user} maxWidth="3xl">
		<header class="mb-6">
			<h1 class="text-2xl font-semibold text-foreground">Share Your Feedback</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Hi {data.user.name || 'there'}, tell us how your experience with Solar Vipani has been. It
				takes less than two minutes.
			</p>
		</header>

		{#if data.feedback}
			<Alert variant="accent" class="mb-4">
				You have shared feedback before — submitting again will update it.
			</Alert>
		{/if}

		{#if form?.error}
			<Alert variant="destructive" class="mb-4">{form.error}</Alert>
		{/if}

		<Card class="p-5 md:p-6">
			<form
				method="POST"
				class="space-y-8"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						submitting = false;
						await update();
					};
				}}
			>
				<fieldset>
					<legend class="mb-3 text-sm font-medium text-foreground">
						1. Did you get a callback from the installer?
					</legend>
					<div class="inline-flex overflow-hidden rounded-md border border-border">
						<label
							class="cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-150 {gotCallback ===
							'yes'
								? 'bg-primary text-primary-foreground'
								: 'bg-card text-foreground-secondary hover:bg-background-tertiary'}"
						>
							<input
								type="radio"
								name="gotCallback"
								value="yes"
								bind:group={gotCallback}
								required
								class="sr-only"
							/>
							Yes
						</label>
						<label
							class="cursor-pointer border-l border-border px-4 py-2 text-sm font-medium transition-colors duration-150 {gotCallback ===
							'no'
								? 'bg-primary text-primary-foreground'
								: 'bg-card text-foreground-secondary hover:bg-background-tertiary'}"
						>
							<input
								type="radio"
								name="gotCallback"
								value="no"
								bind:group={gotCallback}
								class="sr-only"
							/>
							No
						</label>
					</div>
				</fieldset>

				<fieldset>
					<legend class="mb-3 text-sm font-medium text-foreground">
						2. Did you get a quotation from the installer?
					</legend>
					<div class="inline-flex overflow-hidden rounded-md border border-border">
						<label
							class="cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-150 {gotQuotation ===
							'yes'
								? 'bg-primary text-primary-foreground'
								: 'bg-card text-foreground-secondary hover:bg-background-tertiary'}"
						>
							<input
								type="radio"
								name="gotQuotation"
								value="yes"
								bind:group={gotQuotation}
								required
								class="sr-only"
							/>
							Yes
						</label>
						<label
							class="cursor-pointer border-l border-border px-4 py-2 text-sm font-medium transition-colors duration-150 {gotQuotation ===
							'no'
								? 'bg-primary text-primary-foreground'
								: 'bg-card text-foreground-secondary hover:bg-background-tertiary'}"
						>
							<input
								type="radio"
								name="gotQuotation"
								value="no"
								bind:group={gotQuotation}
								class="sr-only"
							/>
							No
						</label>
					</div>
				</fieldset>

				<fieldset>
					<legend class="mb-3 text-sm font-medium text-foreground">
						3. How likely are you to recommend Solar Vipani to a friend?
					</legend>
					<div
						class="flex items-center gap-1"
						role="radiogroup"
						tabindex="-1"
						aria-label="Recommendation rating from 1 to 5 stars"
						onmouseleave={() => (hoverRating = 0)}
					>
						{#each [1, 2, 3, 4, 5] as star}
							<button
								type="button"
								class="rounded p-1 text-2xl leading-none transition-colors duration-150 {star <=
								(hoverRating || rating)
									? 'text-warning'
									: 'text-border-hover hover:text-warning/60'}"
								aria-label="{star} star{star > 1 ? 's' : ''} — {ratingLabels[star]}"
								aria-pressed={rating === star}
								onclick={() => (rating = star)}
								onmouseenter={() => (hoverRating = star)}
							>
								★
							</button>
						{/each}
					</div>
					<p class="mt-2 text-sm text-muted-foreground">
						{#if hoverRating || rating}
							{ratingLabels[hoverRating || rating]}
						{:else}
							1 star — not at all, 5 stars — very high
						{/if}
					</p>
					<input type="hidden" name="rating" value={rating} />
				</fieldset>

				<fieldset>
					<legend class="mb-3 text-sm font-medium text-foreground">
						4. Suggestions to make our service better for future users like you
						<span class="font-normal text-muted-foreground">(optional)</span>
					</legend>
					<textarea
						name="suggestions"
						rows="4"
						maxlength="2000"
						placeholder="Tell us what we could do better..."
						bind:value={suggestions}
						class="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
					></textarea>
				</fieldset>

				<div class="flex flex-col items-end gap-2 border-t border-border pt-6">
					<Button type="submit" disabled={submitting || rating === 0}>
						{submitting ? 'Submitting...' : 'Submit Feedback'}
					</Button>
					{#if rating === 0}
						<p class="text-xs text-muted-foreground">Please select a star rating to submit.</p>
					{/if}
				</div>
			</form>
		</Card>
	</AppShell>
{/if}
