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

<main class="mx-auto max-w-2xl px-5 py-5">
	<h1 class="text-2xl font-display mb-5">SolarVipani AI Assistant</h1>

	<!-- Chat history -->
	<div class="max-h-96 overflow-y-auto mb-5 p-2.5 border rounded bg-background">
		{#each $messages as message}
			<div class="mb-2.5" class:text-right={message.role === 'user'} class:text-left={message.role === 'assistant'}>
				<strong>{message.role === 'user' ? 'You' : 'Solar PV Expert'}:</strong>
				<p>{message.content}</p>
			</div>
		{/each}
	</div>

	<!-- Chat input -->
	<div class="flex gap-2.5">
		<input
			type="text"
			bind:value={userInput}
			placeholder="Ask your Solar PV question..."
			onkeypress={(e) => e.key === 'Enter' && sendMessage()}
			class="flex-1 p-2.5 text-base border rounded bg-background text-foreground placeholder-foreground-muted"
		/>
		<button onclick={sendMessage} class="px-5 py-2.5 text-base bg-primary text-primary-foreground border-none rounded cursor-pointer transition-opacity duration-100 hover:opacity-90">Send</button>
	</div>
</main>
