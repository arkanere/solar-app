<script>
	let { show = $bindable(false) } = $props();

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const close = () => {
		show = false;
		dispatch('close');
	};
</script>

{#if show}
	<div role="dialog" aria-modal="true" aria-labelledby="support-title" class="modal-overlay">
		<div class="modal">
			<button class="close-modal" aria-label="Close dialog" on:click={close}>&times;</button>
			<div class="modal-content">
				<h2 id="support-title">Support</h2>
				<p>
					<a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a><br />
					or call us at <a href="tel:+918983066701">+91 8983066701</a>
				</p>
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
		max-width: 500px;
		width: 100%;
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
		gap: 10px;
		text-align: center;
	}

	h2 {
		margin-bottom: 16px;
	}

	p {
		margin-bottom: 20px;
		line-height: 1.6;
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
</style>
