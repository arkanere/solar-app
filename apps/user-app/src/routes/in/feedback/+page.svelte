<script>
	import { enhance } from '$app/forms';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let gotCallback = data.feedback ? (data.feedback.gotCallback ? 'yes' : 'no') : '';
	let gotQuotation = data.feedback ? (data.feedback.gotQuotation ? 'yes' : 'no') : '';
	let rating = data.feedback?.recommendationRating || 0;
	let hoverRating = 0;
	let suggestions = data.feedback?.suggestions || '';
	let submitting = false;

	const ratingLabels = {
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

<main>
	{#if !data.user}
		<section class="login-section">
			<div class="card">
				<h1>Share Your Feedback</h1>
				<p class="subtitle">
					To share your feedback, please use the sign-in link sent to you by email from Solar
					Vipani.
				</p>
				<p class="hint">
					Check your inbox for an email from <strong>Solar Vipani</strong>.
				</p>
			</div>
		</section>
	{:else if form?.success}
		<section class="login-section">
			<div class="card thank-you-card">
				<h1>Thank you! 🙏</h1>
				<p class="subtitle">
					Your feedback has been recorded. It directly shapes what we build next and helps other
					homeowners go solar with confidence.
				</p>
				<a href="/in" class="back-link">Back to dashboard</a>
			</div>
		</section>
	{:else}
		<section class="login-section">
			<div class="card">
				<h1>Share Your Feedback</h1>
				<p class="subtitle">
					Hi {data.user.name || 'there'}, tell us how your experience with Solar Vipani has been.
					It takes less than two minutes.
				</p>

				{#if data.feedback}
					<p class="hint">You have shared feedback before — submitting again will update it.</p>
				{/if}

				{#if form?.error}
					<p class="error">{form.error}</p>
				{/if}

				<form
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							submitting = false;
							await update();
						};
					}}
				>
					<fieldset>
						<legend>1. Did you get a callback from the installer?</legend>
						<div class="yes-no-group">
							<label class="yes-no-option" class:selected={gotCallback === 'yes'}>
								<input type="radio" name="gotCallback" value="yes" bind:group={gotCallback} required />
								Yes
							</label>
							<label class="yes-no-option" class:selected={gotCallback === 'no'}>
								<input type="radio" name="gotCallback" value="no" bind:group={gotCallback} />
								No
							</label>
						</div>
					</fieldset>

					<fieldset>
						<legend>2. Did you get a quotation from the installer?</legend>
						<div class="yes-no-group">
							<label class="yes-no-option" class:selected={gotQuotation === 'yes'}>
								<input type="radio" name="gotQuotation" value="yes" bind:group={gotQuotation} required />
								Yes
							</label>
							<label class="yes-no-option" class:selected={gotQuotation === 'no'}>
								<input type="radio" name="gotQuotation" value="no" bind:group={gotQuotation} />
								No
							</label>
						</div>
					</fieldset>

					<fieldset>
						<legend>3. How likely are you to recommend Solar Vipani to a friend?</legend>
						<div
							class="star-group"
							role="radiogroup"
							aria-label="Recommendation rating from 1 to 5 stars"
							on:mouseleave={() => (hoverRating = 0)}
						>
							{#each [1, 2, 3, 4, 5] as star}
								<button
									type="button"
									class="star"
									class:filled={star <= (hoverRating || rating)}
									aria-label="{star} star{star > 1 ? 's' : ''} — {ratingLabels[star]}"
									aria-pressed={rating === star}
									on:click={() => (rating = star)}
									on:mouseenter={() => (hoverRating = star)}
								>
									★
								</button>
							{/each}
						</div>
						<p class="rating-label">
							{#if hoverRating || rating}
								{ratingLabels[hoverRating || rating]}
							{:else}
								1 star — not at all, 5 stars — very high
							{/if}
						</p>
						<input type="hidden" name="rating" value={rating} />
					</fieldset>

					<fieldset>
						<legend>4. Suggestions to make our service better for future users like you <span class="optional">(optional)</span></legend>
						<textarea
							name="suggestions"
							rows="4"
							maxlength="2000"
							placeholder="Tell us what we could do better..."
							bind:value={suggestions}
						></textarea>
					</fieldset>

					<button type="submit" class="submit-btn" disabled={submitting || rating === 0}>
						{submitting ? 'Submitting...' : 'Submit Feedback'}
					</button>
					{#if rating === 0}
						<p class="hint submit-hint">Please select a star rating to submit.</p>
					{/if}
				</form>
			</div>
		</section>
	{/if}
</main>

<style>
	:root {
		--primary-color: #0056b3;
		--primary-hover: #004494;
		--primary-light: #e6f0ff;
		--accent-color: #ffc107;
		--text-dark: #2c3e50;
		--text-medium: #546e7a;
		--light-bg-color: #f8f9fa;
		--light-card-bg: #ffffff;
		--border-radius-sm: 4px;
		--border-radius-md: 8px;
		--border-radius-lg: 16px;
		--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
	}

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	main {
		width: 100%;
		font-family: var(--font-family);
		line-height: 1.6;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		min-height: 100vh;
		background-color: var(--light-bg-color);
		color: var(--text-dark);
	}

	.login-section {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
	}

	.card {
		background: var(--light-card-bg);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		padding: 2.5rem 2rem;
		width: 100%;
		max-width: 560px;
	}

	.card h1 {
		font-size: 1.8rem;
		color: var(--primary-color);
		margin-bottom: 0.75rem;
	}

	.subtitle {
		color: var(--text-dark);
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	.hint {
		color: var(--text-medium);
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.error {
		color: #c0392b;
		background: #fdecea;
		border-radius: var(--border-radius-sm);
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	fieldset {
		border: none;
		margin-bottom: 1.75rem;
	}

	legend {
		font-weight: 600;
		font-size: 1rem;
		color: var(--text-dark);
		margin-bottom: 0.75rem;
	}

	.optional {
		font-weight: 400;
		color: var(--text-medium);
		font-size: 0.85rem;
	}

	.yes-no-group {
		display: flex;
		gap: 0.75rem;
	}

	.yes-no-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.5rem;
		border: 1px solid #d0d7de;
		border-radius: var(--border-radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.95rem;
	}

	.yes-no-option:hover {
		border-color: var(--primary-color);
	}

	.yes-no-option.selected {
		background: var(--primary-light);
		border-color: var(--primary-color);
		color: var(--primary-color);
		font-weight: 600;
	}

	.star-group {
		display: flex;
		gap: 0.25rem;
	}

	.star {
		background: none;
		border: none;
		font-size: 2.2rem;
		line-height: 1;
		color: #d0d7de;
		cursor: pointer;
		transition: color 0.15s ease, transform 0.15s ease;
		padding: 0.1rem;
	}

	.star:hover {
		transform: scale(1.15);
	}

	.star.filled {
		color: var(--accent-color);
	}

	.rating-label {
		font-size: 0.85rem;
		color: var(--text-medium);
		margin-top: 0.4rem;
		min-height: 1.3em;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d0d7de;
		border-radius: var(--border-radius-md);
		font-family: var(--font-family);
		font-size: 0.95rem;
		resize: vertical;
	}

	textarea:focus {
		outline: none;
		border-color: var(--primary-color);
	}

	.submit-btn {
		background: var(--primary-color);
		color: #ffffff;
		border: none;
		border-radius: var(--border-radius-md);
		padding: 0.85rem 2.5rem;
		font-size: 1rem;
		font-weight: 600;
		font-family: var(--font-family);
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.submit-btn:hover:not(:disabled) {
		background: var(--primary-hover);
	}

	.submit-btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.submit-hint {
		margin-top: 0.5rem;
		margin-bottom: 0;
	}

	.thank-you-card {
		text-align: center;
	}

	.back-link {
		display: inline-block;
		margin-top: 1rem;
		color: var(--primary-color);
		font-weight: 600;
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
	}
</style>
