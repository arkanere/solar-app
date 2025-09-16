<script>
	export let show = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const close = () => {
		show = false;
		dispatch('close');
	};
</script>

{#if show}
	<div role="dialog" aria-modal="true" aria-labelledby="ranking-policy-title" class="modal-overlay">
		<div class="modal">
			<button class="close-modal" aria-label="Close dialog" on:click={close}>&times;</button>
			<div class="modal-content">
				<h2 id="ranking-policy-title">Policy</h2>
				<div class="policy-content">
					<h3>Non-Exclusive Lead Allotment</h3>
					<p>Our lead distribution system works on a <strong>non-exclusive basis</strong> to ensure fair opportunity for all qualified businesses:</p>
					<ul>
						<li><strong>Lead Distribution:</strong> Each lead is allotted to 4 businesses simultaneously</li>
						<li><strong>First Come, First Served:</strong> Leads are distributed on a first come, first served basis to eligible businesses</li>
						<li><strong>Response Time Matters:</strong> Quick response to leads increases your chances of conversion</li>
						<li><strong>Equal Opportunity:</strong> All businesses have an equal chance to connect with potential customers</li>
					</ul>
					
					<h3>Business Ranking Factors</h3>
					<p>Your business ranking on Solar Vipani is determined by several factors:</p>
					<ul>
						<li><strong>Profile Completion:</strong> Businesses with complete profiles rank higher</li>
						<li><strong>Recent Projects:</strong> Posting recent solar installation projects significantly improves your ranking</li>
					</ul>
					<p><strong>Pro Tip:</strong> Regularly update your profile and post recent projects to maintain high ranking!</p>
				</div>
				<button on:click={close}>Close</button>
			</div>
		</div>
		<!-- Use a button with fixed position and full coverage to handle outside clicks -->
		<button class="modal-backdrop" on:click={close} aria-label="Close dialog"></button>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		border: none;
		cursor: default;
		z-index: -1;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal {
		position: relative;
		z-index: 1001;
		background: white;
		padding: 20px;
		border-radius: 5px;
		max-width: 600px;
		width: 100%;
		max-height: 80vh;
		overflow-y: auto;
	}

	.close-modal {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.policy-content {
		text-align: left;
	}

	h2 {
		margin-bottom: 16px;
		text-align: center;
		color: #0056b3;
	}

	h3 {
		margin-top: 20px;
		margin-bottom: 12px;
		color: #0056b3;
		font-size: 1.2rem;
	}

	p {
		margin-bottom: 15px;
		line-height: 1.6;
	}

	ul {
		margin-left: 20px;
		margin-bottom: 15px;
	}

	li {
		margin-bottom: 8px;
		line-height: 1.5;
	}

	a {
		color: #0066cc;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	button {
		padding: 8px 16px;
		background-color: #f1f1f1;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
		margin: 0 auto;
		width: fit-content;
	}

	button:hover {
		background-color: #e1e1e1;
	}
</style>