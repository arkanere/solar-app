import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { type Index, type QueryResponse, type RecordMetadata, Pinecone } from '@pinecone-database/pinecone';
import { OPENAI_API_KEY, PINECONE_API_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

interface ChatRequest {
	userMessage: string;
	conversationContext?: string;
}

// Helper function to determine if guided flow should be suggested
function isGuidedFlowQuery(message: string): boolean {
	const guidedFlowTriggers = [
		'install solar',
		'solar system',
		'sizing',
		'pricing',
		'cost',
		'quote',
		'estimate',
		'how much',
		'calculate',
		'recommend',
		'my home',
		'my business',
		'savings',
		'payback',
		'system size',
		'solar panel',
		'property',
		'residential',
		'commercial',
		'agriculture',
		'kw',
		'kwh',
		'units',
		'electricity bill',
		'monthly usage',
		'consumption',
		'subsidy',
		'emi',
		'finance',
		'investment'
	];

	const lowerMessage = message.toLowerCase();
	return guidedFlowTriggers.some((trigger) => lowerMessage.includes(trigger));
}

export const POST: RequestHandler = async ({ request }) => {
	console.log('Chatbot API request started');

	try {
		console.log('Parsing request body');
		const { userMessage, conversationContext }: ChatRequest = await request.json();
		console.log('User message received:', userMessage);

		// Initialize OpenAI Embeddings with LangChain
		console.log('Initializing OpenAI client');
		const embeddings = new OpenAIEmbeddings({
			openAIApiKey: OPENAI_API_KEY,
			modelName: 'text-embedding-ada-002'
		});
		console.log('OpenAI client initialized successfully');

		// Initialize Pinecone client
		console.log('Initializing Pinecone client');
		const pinecone = new Pinecone({
			apiKey: PINECONE_API_KEY
		});
		console.log('Pinecone client initialized successfully');

		// Index name
		const INDEX_NAME = 'solarvipani';

		// Step 1: Convert the user query to an embedding
		console.log('Creating embedding for user query');
		const queryEmbedding = await embeddings.embedQuery(userMessage);
		console.log('Embedding created successfully');
		console.log('Embedding dimensions:', queryEmbedding.length);

		// Step 2: Initialize Pinecone VectorStore with LangChain
		console.log('Querying Pinecone for similar documents');

		const index: Index<RecordMetadata> = pinecone.index(INDEX_NAME);

		// Query directly to maintain same logging behavior
		const queryResult: QueryResponse<RecordMetadata> = await index.query({
			vector: queryEmbedding,
			topK: 3,
			includeMetadata: true
		});
		console.log('Pinecone query completed');

		// Step 3: Extract and prepare context from retrieved documents
		console.log('Preparing context from retrieved documents');
		let retrievedContext = '';

		if (queryResult.matches && queryResult.matches.length > 0) {
			retrievedContext = queryResult.matches
				.map((match) => {
					const source = match.metadata?.file_name || match.metadata?.source || 'Unknown source';
					return `From ${source}:\n${match.metadata?.text || ''}`;
				})
				.join('\n\n');
		} else {
			retrievedContext = 'No relevant information found in the knowledge base.';
		}

		// Step 4: Build system prompt with context and intent detection
		console.log('Building system prompt with context and intent detection');

		let baseSystemPrompt = `You are a chatbot on Solar Vipani website. Your job is to help website users by answering their questions. Assume users are customers.

If the user is asking about solar system sizing, pricing, costs, their specific property (residential/business/agriculture), how much solar they need, savings calculations, system recommendations, or wants a quote/estimate, respond with your helpful answer, then at the end add this EXACT text with the marker:

SUGGEST_GUIDED_FLOW: Would you like me to help you calculate the right solar system size and pricing for your specific needs? I can guide you through a quick assessment.

Otherwise, just provide a helpful response about solar energy without suggesting the guided flow.`;

		// Add conversation context if provided
		if (conversationContext && conversationContext.trim()) {
			baseSystemPrompt += `\n\nPrevious conversation context:\n${conversationContext}\n`;
		}

		// Step 5: Generate streaming response using LangChain
		console.log('Generating AI response (streaming)');

		const model = new ChatOpenAI({
			openAIApiKey: OPENAI_API_KEY,
			modelName: 'gpt-5.4-nano',
			temperature: 0,
			streaming: true
		});

		const systemContent =
			baseSystemPrompt +
			`\nAnswer questions based on the following retrieved information. If the information doesn't contain the answer, respond with: 'This is beyond my current expertise, try talking to a human expert at admin@solarvipani.com'\n\nRetrieved information:\n${retrievedContext}`;

		const llmStream = await model.stream([
			{ role: 'system', content: systemContent },
			{ role: 'user', content: userMessage }
		]);

		// The model is instructed to place this marker at the very end. We stream the
		// main answer to the client and hold back anything after the marker, emitting it
		// as a separate `suggestion` event once generation completes.
		const MARKER = 'SUGGEST_GUIDED_FLOW:';
		const DEFAULT_SUGGESTION =
			'Would you like me to help you calculate the right solar system size and pricing for your specific needs? I can guide you through a quick assessment.';
		const shouldSuggestGuidedFlow = isGuidedFlowQuery(userMessage);

		const encoder = new TextEncoder();
		const send = (controller: ReadableStreamDefaultController, obj: unknown) =>
			controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

		const stream = new ReadableStream({
			async start(controller) {
				let buffer = ''; // main-reply text not yet flushed to the client
				let suggestion = ''; // text captured after the marker
				let markerHit = false;
				try {
					for await (const chunk of llmStream) {
						const token = typeof chunk.content === 'string' ? chunk.content : '';
						if (!token) continue;
						if (markerHit) {
							suggestion += token;
							continue;
						}
						buffer += token;
						const idx = buffer.indexOf(MARKER);
						if (idx !== -1) {
							const before = buffer.slice(0, idx);
							if (before) send(controller, { type: 'delta', text: before });
							suggestion = buffer.slice(idx + MARKER.length);
							markerHit = true;
							buffer = '';
							continue;
						}
						// Hold back a possible partial marker straddling the tail of the buffer.
						const safeLen = buffer.length - (MARKER.length - 1);
						if (safeLen > 0) {
							send(controller, { type: 'delta', text: buffer.slice(0, safeLen) });
							buffer = buffer.slice(safeLen);
						}
					}
					// Flush any remaining main-reply text (no marker was emitted).
					if (!markerHit && buffer) send(controller, { type: 'delta', text: buffer });

					// Resolve the guided-flow suggestion: prefer the model's own text, else
					// inject the default when the query qualifies but no marker was emitted.
					let finalSuggestion = markerHit ? suggestion.trim() : '';
					if (!finalSuggestion && shouldSuggestGuidedFlow) finalSuggestion = DEFAULT_SUGGESTION;
					if (finalSuggestion) send(controller, { type: 'suggestion', text: finalSuggestion });

					send(controller, { type: 'done' });
				} catch (err) {
					console.error('Streaming error:', (err as Error).message);
					send(controller, { type: 'error' });
				} finally {
					controller.close();
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'application/x-ndjson; charset=utf-8',
				'Cache-Control': 'no-cache, no-transform'
			}
		});
	} catch (error) {
		console.error('Error occurred:', (error as Error).message);

		return json({ error: 'Failed to process your request.' }, { status: 500 });
	}
};