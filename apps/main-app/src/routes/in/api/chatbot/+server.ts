import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { RetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { OPENAI_API_KEY, PINECONE_API_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

interface ChatRequest {
	userMessage: string;
	conversationContext?: string;
}

interface QueryMatch {
	score: number;
	metadata?: {
		file_name?: string;
		text?: string;
	};
}

interface QueryResult {
	matches?: QueryMatch[];
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
		const INDEX_NAME = 'solar-vipani-knowledge';

		// Step 1: Convert the user query to an embedding
		console.log('Creating embedding for user query');
		const embeddingStartTime = Date.now();

		const queryEmbedding = await embeddings.embedQuery(userMessage);

		const embeddingEndTime = Date.now();
		console.log('Embedding created successfully');
		console.log('Embedding dimensions:', queryEmbedding.length);

		// Step 2: Initialize Pinecone VectorStore with LangChain
		console.log('Querying Pinecone for similar documents');
		const pineconeStartTime = Date.now();

		const index = pinecone.index(INDEX_NAME);

		// Create vector store
		const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
			pineconeIndex: index
		});

		// Query directly to maintain same logging behavior
		const queryResult: QueryResult = await index.query({
			vector: queryEmbedding,
			topK: 3,
			includeMetadata: true
		});

		const pineconeEndTime = Date.now();
		console.log('Pinecone query completed');

		// Step 3: Extract and prepare context from retrieved documents
		console.log('Preparing context from retrieved documents');
		let retrievedContext = '';

		if (queryResult.matches && queryResult.matches.length > 0) {
			retrievedContext = queryResult.matches
				.map((match) => {
					const source = match.metadata?.file_name || 'Unknown source';
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

		// Step 5: Generate response using LangChain
		console.log('Generating AI response');
		const chatStartTime = Date.now();

		const model = new ChatOpenAI({
			openAIApiKey: OPENAI_API_KEY,
			modelName: 'gpt-3.5-turbo',
			temperature: 0
		});

		const response = await model.invoke([
			{
				role: 'system',
				content: baseSystemPrompt + `\nAnswer questions based on the following retrieved information. If the information doesn't contain the answer, respond with: 'This is beyond my current expertise, try talking to a human expert at admin@solarvipani.com'\n\nRetrieved information:\n${retrievedContext}`
			},
			{ role: 'user', content: userMessage }
		]);

		const chatEndTime = Date.now();
		let assistantReply = response.content as string;

		console.log('AI response generated successfully');

		// Step 6: Validate and correct guided flow suggestion
		console.log('Validating guided flow suggestion');

		const shouldSuggestGuidedFlow = isGuidedFlowQuery(userMessage);
		const hasProperMarker = assistantReply.includes('SUGGEST_GUIDED_FLOW:');

		if (shouldSuggestGuidedFlow && !hasProperMarker) {
			const guidancePatterns = [
				/Would you like me to help you calculate[^?]*\?[^?]*assessment\.?/i,
				/Would you like me to help[^?]*calculate[^?]*\?/i,
				/I can help you calculate[^?]*\?/i,
				/Let me help you calculate[^?]*\?/i
			];

			let correctionMade = false;

			for (const pattern of guidancePatterns) {
				if (pattern.test(assistantReply)) {
					assistantReply = assistantReply.replace(
						pattern,
						'SUGGEST_GUIDED_FLOW: Would you like me to help you calculate the right solar system size and pricing for your specific needs? I can guide you through a quick assessment.'
					);
					correctionMade = true;
					break;
				}
			}

			if (!correctionMade) {
				assistantReply += '\n\nSUGGEST_GUIDED_FLOW: Would you like me to help you calculate the right solar system size and pricing for your specific needs? I can guide you through a quick assessment.';
			}
		}

		return json({ reply: assistantReply });
	} catch (error) {
		console.error('Error occurred:', (error as Error).message);

		return json({ error: 'Failed to process your request.' }, { status: 500 });
	}
};
