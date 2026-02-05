<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import ChatBotBox from '$lib/us/ChatBotBox.svelte';

	// Store to maintain message history and popup state
	let { messages = writable([]), isVisible = true } = $props();
	let isManuallyDismissed = false;

	// Function to close the popup
	function closePopup() {
		isManuallyDismissed = true;
	}

	// Reset manual dismissal when popup becomes invisible (user scrolled up)
	$effect(() => {
		if (!isVisible) {
			isManuallyDismissed = false;
		}
	});

	onMount(() => {
		console.log('[ChatbotPopup] Component mounted');
		// Don't disable body scroll - allow page scrolling to hide/show popup

		// Cleanup on unmount
		return () => {
			console.log('[ChatbotPopup] Component unmounting');
		};
	});

	// Prevent click propagation on the modal content
	function handleModalClick(event) {
		event.stopPropagation();
	}
</script>

{#if isVisible && !isManuallyDismissed}
	<div class="modal-backdrop"></div>
	<div class="chatbot-popup-wrapper">
		<ChatBotBox {messages} onClose={closePopup} />
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 9999;
		backdrop-filter: blur(2px);
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.chatbot-popup-wrapper {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
		max-width: 900px;
		max-height: 85vh;
		z-index: 10000;
		animation: slideUp 0.4s ease-out;
	}

	@keyframes slideUp {
		from {
			transform: translate(-50%, -40%);
			opacity: 0;
		}
		to {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.chatbot-popup-wrapper {
			width: 95%;
			max-height: 90vh;
		}
	}

	@media (max-width: 480px) {
		.chatbot-popup-wrapper {
			width: 100%;
			height: 100%;
			max-height: 100vh;
			top: 0;
			left: 0;
			transform: none;
		}
	}
</style>
