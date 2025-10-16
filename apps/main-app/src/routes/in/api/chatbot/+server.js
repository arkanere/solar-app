// file at /routes/api/chatbot/+server.js
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { RetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { OPENAI_API_KEY, PINECONE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

// Helper function to determine if guided flow should be suggested
function isGuidedFlowQuery(message) {
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

export async function POST({ request }) {
	console.log('🚀 === CHATBOT API REQUEST STARTED ===');
	console.log('📅 Timestamp:', new Date().toISOString());

	try {
		// Parse incoming request
		console.log('📥 Parsing request body...');
		const { userMessage, conversationContext } = await request.json();
		console.log('💬 User message received:', userMessage);
		console.log('📏 Message length:', userMessage.length, 'characters');

		// Log conversation context if provided
		if (conversationContext && conversationContext.trim()) {
			console.log('📋 Conversation context provided');
			console.log('📏 Context length:', conversationContext.length, 'characters');
			console.log('📄 === FULL CONVERSATION CONTEXT ===');
			console.log(conversationContext);
			console.log('=== END CONVERSATION CONTEXT ===\n');
		} else {
			console.log('📋 No conversation context provided');
		}

		// Initialize OpenAI Embeddings with LangChain
		console.log('🔧 Initializing OpenAI client...');
		const embeddings = new OpenAIEmbeddings({
			openAIApiKey: OPENAI_API_KEY,
			modelName: 'text-embedding-ada-002'
		});
		console.log('✅ OpenAI client initialized successfully');

		// Initialize Pinecone client
		console.log('🔧 Initializing Pinecone client...');
		const pinecone = new Pinecone({
			apiKey: PINECONE_API_KEY
		});
		console.log('✅ Pinecone client initialized successfully');

		// Index name
		const INDEX_NAME = 'solar-vipani-knowledge';
		console.log('📚 Using Pinecone index:', INDEX_NAME);

		// Step 1: Convert the user query to an embedding (done internally by LangChain)
		console.log('\n🔄 STEP 1: Creating embedding for user query...');
		const embeddingStartTime = Date.now();

		// Get the embedding manually to log it (matching original behavior)
		const queryEmbedding = await embeddings.embedQuery(userMessage);

		const embeddingEndTime = Date.now();
		console.log('✅ Embedding created successfully');
		console.log('📊 Embedding dimensions:', queryEmbedding.length);
		console.log('⏱️ Embedding creation time:', embeddingEndTime - embeddingStartTime, 'ms');
		console.log('🔢 First 5 embedding values:', queryEmbedding.slice(0, 5));

		// Step 2: Initialize Pinecone VectorStore with LangChain
		console.log('\n🔍 STEP 2: Querying Pinecone for similar documents...');
		const pineconeStartTime = Date.now();

		const index = pinecone.index(INDEX_NAME);
		console.log('📂 Pinecone index object created');

		// Create vector store
		const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
			pineconeIndex: index
		});

		// Query directly to maintain same logging behavior
		const queryResult = await index.query({
			vector: queryEmbedding,
			topK: 3,
			includeMetadata: true
		});

		const pineconeEndTime = Date.now();
		console.log('✅ Pinecone query completed');
		console.log('⏱️ Pinecone query time:', pineconeEndTime - pineconeStartTime, 'ms');
		console.log('📊 Number of matches found:', queryResult.matches?.length || 0);

		// Log detailed match information
		if (queryResult.matches && queryResult.matches.length > 0) {
			console.log('🎯 Match details:');
			queryResult.matches.forEach((match, index) => {
				console.log(`\n  === Match ${index + 1} ===`);
				console.log(`    Score: ${match.score}`);
				console.log(`    Source: ${match.metadata?.file_name || 'Unknown'}`);
				console.log(`    Text length: ${(match.metadata?.text || '').length} characters`);
				console.log(`    FULL TEXT:`);
				console.log(`    ${match.metadata?.text || 'No text available'}`);
				console.log(`  === End Match ${index + 1} ===\n`);
			});
		} else {
			console.log('⚠️ No matches found in Pinecone');
		}

		// Step 3: Extract and prepare context from retrieved documents
		console.log('\n📝 STEP 3: Preparing context from retrieved documents...');
		let retrievedContext = '';

		if (queryResult.matches && queryResult.matches.length > 0) {
			retrievedContext = queryResult.matches
				.map((match) => {
					const source = match.metadata?.file_name || 'Unknown source';
					return `From ${source}:\n${match.metadata?.text || ''}`;
				})
				.join('\n\n');

			console.log('✅ Context prepared from', queryResult.matches.length, 'documents');
			console.log('📏 Total context length:', retrievedContext.length, 'characters');
			console.log('\n📄 === FULL RETRIEVED CONTEXT ===');
			console.log(retrievedContext);
			console.log('=== END FULL RETRIEVED CONTEXT ===\n');
		} else {
			retrievedContext = 'No relevant information found in the knowledge base.';
			console.log('⚠️ Using fallback context - no relevant information found');
		}

		// Step 4: Build system prompt with context and intent detection
		console.log('\n🤖 STEP 4: Building system prompt with context and intent detection...');

		// Enhanced system prompt with better instructions for exact text inclusion
		let baseSystemPrompt = `You are a chatbot on Solar Vipani website. Your job is to help website users by answering their questions. Assume users are customers.

If the user is asking about solar system sizing, pricing, costs, their specific property (residential/business/agriculture), how much solar they need, savings calculations, system recommendations, or wants a quote/estimate, respond with your helpful answer, then at the end add this EXACT text with the marker:

SUGGEST_GUIDED_FLOW: Would you like me to help you calculate the right solar system size and pricing for your specific needs? I can guide you through a quick assessment.

IMPORTANT: You must include the exact marker "SUGGEST_GUIDED_FLOW:" at the beginning of that final question.

Otherwise, just provide a helpful response about solar energy without suggesting the guided flow.`;

		// Add conversation context if provided
		if (conversationContext && conversationContext.trim()) {
			baseSystemPrompt += `\n\nPrevious conversation context:\n${conversationContext}\n`;
			console.log('📋 Added conversation context to system prompt');
		}

		const promptTemplate = PromptTemplate.fromTemplate(
			baseSystemPrompt +
				`\nAnswer questions based on the following retrieved information. If the information doesn't contain the answer, respond with: 'This is beyond my current expertise, try talking to a human expert at admin@solarvipani.com'
          
Retrieved information:
{context}

Question: {question}
Answer:`
		);

		console.log(
			'📝 Final system prompt length:',
			(baseSystemPrompt + retrievedContext).length,
			'characters'
		);
		console.log('🔧 Using model: gpt-3.5-turbo');
		console.log('🎯 Intent detection enabled for guided flow suggestions');

		// Step 5: Generate response using LangChain
		console.log('\n🤖 STEP 5: Generating AI response...');
		const chatStartTime = Date.now();

		// Initialize ChatOpenAI model
		const model = new ChatOpenAI({
			openAIApiKey: OPENAI_API_KEY,
			modelName: 'gpt-3.5-turbo',
			temperature: 0,
			callbacks: [
				{
					handleLLMStart: async (llm, prompts) => {
						// Log the messages array to match original behavior
						const messages = [
							{
								role: 'system',
								content:
									baseSystemPrompt +
									`\nAnswer questions based on the following retrieved information. If the information doesn't contain the answer, respond with: 'This is beyond my current expertise, try talking to a human expert at admin@solarvipani.com'\n\nRetrieved information:\n${retrievedContext}`
							},
							{ role: 'user', content: userMessage }
						];
						console.log('\n📨 === FULL MESSAGES ARRAY ===');
						console.log(JSON.stringify(messages, null, 2));
						console.log('=== END FULL MESSAGES ARRAY ===\n');
					}
				}
			]
		});

		// Create retrieval chain
		const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever({ k: 3 }), {
			prompt: promptTemplate,
			returnSourceDocuments: false,
			inputKey: 'question'
		});

		// Override the context with our manually retrieved context to maintain exact behavior
		const response = await model.invoke([
			{
				role: 'system',
				content:
					baseSystemPrompt +
					`\nAnswer questions based on the following retrieved information. If the information doesn't contain the answer, respond with: 'This is beyond my current expertise, try talking to a human expert at admin@solarvipani.com'\n\nRetrieved information:\n${retrievedContext}`
			},
			{ role: 'user', content: userMessage }
		]);

		const chatEndTime = Date.now();
		let assistantReply = response.content;

		// Get token usage from the response
		const usage = response.response_metadata?.tokenUsage || {};

		console.log('✅ AI response generated successfully');
		console.log('⏱️ Chat completion time:', chatEndTime - chatStartTime, 'ms');
		console.log('📏 Response length:', assistantReply.length, 'characters');
		console.log(
			'🔧 Tokens used - Prompt:',
			usage.promptTokens,
			'Completion:',
			usage.completionTokens,
			'Total:',
			usage.totalTokens
		);

		// Step 6: Validate and correct guided flow suggestion
		console.log('\n🔧 STEP 6: Validating guided flow suggestion...');

		const shouldSuggestGuidedFlow = isGuidedFlowQuery(userMessage);
		const hasProperMarker = assistantReply.includes('SUGGEST_GUIDED_FLOW:');

		console.log('🎯 Should suggest guided flow:', shouldSuggestGuidedFlow ? 'Yes' : 'No');
		console.log('🏷️ Has proper marker:', hasProperMarker ? 'Yes' : 'No');

		if (shouldSuggestGuidedFlow && !hasProperMarker) {
			console.log(
				'⚠️ Guided flow should be suggested but marker missing. Attempting correction...'
			);

			// Check if AI included the guidance question but without proper marker
			const guidancePatterns = [
				/Would you like me to help you calculate[^?]*\?[^?]*assessment\.?/i,
				/Would you like me to help[^?]*calculate[^?]*\?/i,
				/I can help you calculate[^?]*\?/i,
				/Let me help you calculate[^?]*\?/i
			];

			let correctionMade = false;

			for (const pattern of guidancePatterns) {
				if (pattern.test(assistantReply)) {
					console.log('🔄 Found existing guidance text, replacing with proper format...');
					assistantReply = assistantReply.replace(
						pattern,
						'SUGGEST_GUIDED_FLOW: Would you like me to help you calculate the right solar system size and pricing for your specific needs? I can guide you through a quick assessment.'
					);
					correctionMade = true;
					break;
				}
			}

			// If no existing guidance found, append the proper suggestion
			if (!correctionMade) {
				console.log('➕ No existing guidance found, appending proper guided flow suggestion...');
				assistantReply +=
					'\n\nSUGGEST_GUIDED_FLOW: Would you like me to help you calculate the right solar system size and pricing for your specific needs? I can guide you through a quick assessment.';
				correctionMade = true;
			}

			if (correctionMade) {
				console.log('✅ Guided flow suggestion corrected successfully');
				console.log('📏 Updated response length:', assistantReply.length, 'characters');
			}
		}

		// Final validation
		const finalHasProperMarker = assistantReply.includes('SUGGEST_GUIDED_FLOW:');

		// Check if guided flow was suggested (updated logic)
		if (finalHasProperMarker) {
			console.log('🎯 Intent detected: AI suggested guided flow transition');
		} else {
			console.log('💬 General conversation: No guided flow suggestion');
		}

		console.log('\n🤖 === FULL ASSISTANT REPLY ===');
		console.log(assistantReply);
		console.log('=== END FULL ASSISTANT REPLY ===\n');

		// Final summary
		console.log('\n📊 === REQUEST SUMMARY ===');
		console.log('✅ Request completed successfully');
		console.log('📏 User message:', userMessage.length, 'chars');
		console.log(
			'📋 Conversation context:',
			conversationContext ? conversationContext.length : 0,
			'chars'
		);
		console.log('📚 Documents retrieved:', queryResult.matches?.length || 0);
		console.log('📝 Retrieved context length:', retrievedContext.length, 'chars');
		console.log('💬 Response length:', assistantReply.length, 'chars');
		console.log('🎯 Should suggest guided flow:', shouldSuggestGuidedFlow ? 'Yes' : 'No');
		console.log('🎯 Guided flow suggested:', finalHasProperMarker ? 'Yes' : 'No');
		console.log('🏁 === CHATBOT API REQUEST COMPLETED ===\n');

		return json({ reply: assistantReply });
	} catch (error) {
		console.error('\n❌ === ERROR OCCURRED ===');
		console.error('🚨 Error type:', error.constructor.name);
		console.error('💥 Error message:', error.message);
		console.error('📍 Error stack:', error.stack);

		// Log specific API errors
		if (error.response) {
			console.error('🌐 API Response Status:', error.response.status);
			console.error('📄 API Response Data:', error.response.data);
		}

		console.error('❌ === ERROR HANDLING COMPLETED ===\n');

		return json({ error: 'Failed to process your request.' }, { status: 500 });
	}
}
