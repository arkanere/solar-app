<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let userInput = $state(''); // Bind input field
	let messages = writable([]); // Message history

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
</script>

<main>
	<h1>SolarVipani AI Assistant</h1>

	<!-- Chat history -->
	<div class="chat-history">
		{#each $messages as message}
			<div class="message {message.role}">
				<strong>{message.role === 'user' ? 'You' : 'Solar PV Expert'}:</strong>
				<p>{message.content}</p>
			</div>
		{/each}
	</div>

	<!-- Chat input -->
	<div class="chat-input">
		<input
			type="text"
			bind:value={userInput}
			placeholder="Ask your Solar PV question..."
			onkeypress={(e) => e.key === 'Enter' && sendMessage()}
		/>
		<button onclick={sendMessage}>Send</button>
	</div>
</main>

<style>
	:root {
		--primary-color: var(--color-primary);
		--border-color: var(--color-border);
		--bg-color: var(--color-background);
		--text-color: var(--color-text-primary);
		--text-foreground: var(--color-foreground);
	}

	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		font-family: Arial, sans-serif;
		color: var(--text-color);
	}

	.chat-history {
		max-height: 400px;
		overflow-y: auto;
		margin-bottom: 20px;
		padding: 10px;
		border: 1px solid var(--border-color);
		border-radius: 5px;
		background: var(--bg-color);
	}

	.message {
		margin-bottom: 10px;
	}

	.message.user {
		text-align: right;
	}

	.message.assistant {
		text-align: left;
	}

	.chat-input {
		display: flex;
		gap: 10px;
	}

	input {
		flex: 1;
		padding: 10px;
		font-size: 16px;
		border: 1px solid var(--border-color);
		border-radius: 5px;
		background: var(--bg-color);
		color: var(--text-color);
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		background-color: var(--primary-color);
		color: var(--color-primary-foreground);
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: opacity 150ms ease;
	}

	button:hover {
		opacity: 0.9;
	}
</style>
