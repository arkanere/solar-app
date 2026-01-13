<script>
	import { writable } from 'svelte/store';
	import { isDarkMode } from '$lib/themeStore';

	// Store to maintain message history
	let { messages = writable([]) } = $props();

	// Widget state
	let isOpen = $state(false);
	let userInput = $state('');
	let unreadMessages = $state(0);

	// Derived values for reactive access
	let isDarkMode = $derived($isDarkMode);
	let messagesList = $derived($messages);

	// Function to toggle chat window
	function toggleChat() {
		isOpen = !isOpen;
		if (isOpen) {
			unreadMessages = 0; // Reset unread count when opening
		}
	}

	// Function to send user message to the backend
	async function sendMessage() {
		if (!userInput.trim()) return;

		// Add the user's message to the message history
		messages.update((m) => [...m, { role: 'user', content: userInput }]);

		try {
			// Send message to backend
			const response = await fetch('/chatbot121212', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userMessage: userInput })
			});

			const { reply } = await response.json();
			messages.update((m) => [...m, { role: 'assistant', content: reply }]);

			// If chat is minimized, increment unread counter
			if (!isOpen) {
				unreadMessages++;
			}
		} catch (err) {
			console.error('Error communicating with chatbot:', err);
			messages.update((m) => [
				...m,
				{ role: 'assistant', content: 'Something went wrong. Try again later.' }
			]);
		} finally {
			userInput = ''; // Clear input field
		}
	}

	// Save messages to localStorage
	$effect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('chatMessages', JSON.stringify(messagesList));
		}
	});

	// Load messages from localStorage on mount
	$effect.pre(() => {
		if (typeof window !== 'undefined') {
			const savedMessages = localStorage.getItem('chatMessages');
			if (savedMessages) {
				messages.set(JSON.parse(savedMessages));
			}
		}
	});
</script>

<div class="chat-widget {isOpen ? 'open' : 'closed'} {isDarkMode ? 'dark-theme' : 'light-theme'}">
	{#if !isOpen}
		<button class="chat-button" on:click={toggleChat}>
			<span>AI Chat Assistant</span>
			{#if unreadMessages > 0}
				<span class="notification-badge">{unreadMessages}</span>
			{/if}
		</button>
	{:else}
		<div class="chat-container">
			<div class="chat-header">
				<h3>SolarVipani AI Assistant</h3>
				<button class="close-button" on:click={toggleChat}>×</button>
			</div>

			<!-- Disclaimer Banner -->
			<div class="disclaimer-banner">
				<p>
					Disclaimer: This chatbot is still in development phase. Responses may be incorrect.
					Messages are stored for performance auditing.
				</p>
			</div>

			<!-- Chat history -->
			<div class="chat-history">
				{#each messagesList as message}
					<div class="message {message.role}">
						<strong>{message.role === 'user' ? 'You' : 'AI Assistant'}:</strong>
						<p>{message.content}</p>
					</div>
				{/each}
			</div>

			<!-- Chat input -->
			<div class="chat-input">
				<input
					type="text"
					bind:value={userInput}
					placeholder="Ask your question here..."
					on:keypress={(e) => e.key === 'Enter' && sendMessage()}
				/>
				<button on:click={sendMessage}>Send</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.chat-widget {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 1000;
		font-family: Georgia, serif;
	}

	.chat-button {
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 50px;
		padding: 12px 20px;
		font-size: 16px;
		cursor: pointer;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
	}

	.chat-button:hover {
		background-color: #0056b3;
	}

	.notification-badge {
		background-color: #ff4d4f;
		color: white;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		font-size: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 8px;
	}

	.chat-container {
		width: 350px;
		height: 500px;
		border-radius: 10px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.chat-header {
		padding: 15px;
		background-color: #007bff;
		color: white;
		border-radius: 10px 10px 0 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.chat-header h3 {
		margin: 0;
		font-size: 16px;
	}

	.close-button {
		background: none;
		border: none;
		color: white;
		font-size: 20px;
		cursor: pointer;
	}

	/* Disclaimer Banner Styles */
	.disclaimer-banner {
		padding: 8px 12px;
		background-color: #fffde7;
		border-bottom: 1px solid #ffe57f;
		font-size: 12px;
	}

	.disclaimer-banner p {
		margin: 0;
		color: #856404;
		line-height: 1.4;
	}

	.dark-theme .disclaimer-banner {
		background-color: #2d2d15;
		border-bottom: 1px solid #584e1f;
		color: #e6d287;
	}

	.dark-theme .disclaimer-banner p {
		color: #e6d287;
	}
	/* End of Disclaimer Styles */

	.chat-history {
		flex: 1;
		overflow-y: auto;
		padding: 15px;
		transition: background-color 0.3s ease;
	}

	.message {
		margin-bottom: 15px;
		padding: 10px;
		border-radius: 5px;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.message.user {
		text-align: right;
	}

	.message.assistant {
		text-align: left;
	}

	.chat-input {
		display: flex;
		padding: 10px;
		transition: border-color 0.3s ease;
	}

	input {
		flex: 1;
		padding: 10px;
		border-radius: 5px 0 0 5px;
		font-size: 14px;
		transition:
			background-color 0.3s ease,
			color 0.3s ease,
			border-color 0.3s ease;
	}

	.chat-input button {
		padding: 10px 15px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 0 5px 5px 0;
		cursor: pointer;
	}

	.chat-input button:hover {
		background-color: #0056b3;
	}

	/* Light Theme */
	.light-theme .chat-container {
		background-color: white;
		color: #333;
	}

	.light-theme .chat-history {
		background-color: #f9f9f9;
	}

	.light-theme .message.user {
		background-color: #e6f7ff;
	}

	.light-theme .message.assistant {
		background-color: #f0f0f0;
	}

	.light-theme .chat-input {
		border-top: 1px solid #eee;
	}

	.light-theme input {
		border: 1px solid #ddd;
		background-color: white;
		color: #333;
	}

	/* Dark Theme */
	.dark-theme .chat-container {
		background-color: #222;
		color: #fff;
	}

	.dark-theme .chat-history {
		background-color: #333;
	}

	.dark-theme .message.user {
		background-color: #1a365d;
	}

	.dark-theme .message.assistant {
		background-color: #444;
	}

	.dark-theme .chat-input {
		border-top: 1px solid #444;
	}

	.dark-theme input {
		border: 1px solid #555;
		background-color: #444;
		color: #fff;
	}

	/* Media queries for mobile responsiveness */
	@media (max-width: 768px) {
		.chat-container {
			width: 300px;
			height: 450px;
		}

		.chat-button {
			padding: 10px 16px;
			font-size: 14px;
		}

		.disclaimer-banner {
			padding: 6px 10px;
			font-size: 11px;
		}
	}
</style>
