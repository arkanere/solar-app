// Original file (e.g., /routes/(layout-3)/chatbot121212/+server.js)
export const prerender = false;
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

// Daily message limit per IP
const MESSAGE_LIMIT = 4;

export async function POST({ request, getClientAddress, fetch }) {
	// Added fetch from event
	try {
		const pool = createPool({ connectionString: POSTGRES_URL });
		const ipAddress = getClientAddress();
		const { userMessage, conversationContext } = await request.json();
		const sessionId = uuidv4(); // Generate unique session ID
		const startTime = Date.now(); // Track processing time

		// Get current date in YYYY-MM-DD format for PostgreSQL
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const dateStr = today.toISOString().split('T')[0];

		// Check if user has exceeded daily message limit
		const checkQuery = `
      SELECT count FROM chatbotmessagecount 
      WHERE ip = $1 AND date = $2
    `;

		const checkResult = await pool.query(checkQuery, [ipAddress, dateStr]);
		const currentCount = checkResult.rows.length > 0 ? checkResult.rows[0].count : 0;

		// If user has reached the limit, return an error message
		if (currentCount >= MESSAGE_LIMIT) {
			return json({
				reply:
					"Apologies. You've reached the daily message limit of 4 questions. Please try again tomorrow."
			});
		}

		// Log the user message to the database
		const logUserMessageQuery = `
      INSERT INTO chatbotmessagesstore (ip, message_type, message_content, session_id)
      VALUES ($1, $2, $3, $4)
    `;

		await pool.query(logUserMessageQuery, [ipAddress, 'user', userMessage, sessionId]);

		// Prepare request payload for downstream API
		const chatbotRequestPayload = { userMessage };

		// Include conversation context if provided
		if (conversationContext && conversationContext.trim()) {
			chatbotRequestPayload.conversationContext = conversationContext;
		}

		// Use fetch from event to call the new API endpoint
		const chatResponse = await fetch('/api/chatbot', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(chatbotRequestPayload)
		});

		if (!chatResponse.ok) {
			throw new Error(`Chatbot API returned status ${chatResponse.status}`);
		}

		const { reply } = await chatResponse.json();
		const processingTime = Date.now() - startTime;

		// Log the assistant's reply to the database
		const logAssistantMessageQuery = `
      INSERT INTO chatbotmessagesstore (ip, message_type, message_content, session_id, processing_time_ms, tokens_used)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

		await pool.query(logAssistantMessageQuery, [
			ipAddress,
			'assistant',
			reply,
			sessionId,
			processingTime,
			null
		]);

		// Update message count in database
		await updateMessageCount(pool, ipAddress, dateStr);

		return json({ reply });
	} catch (error) {
		console.error('API Error:', error);
		return json({ error: 'Failed to process your request.' }, { status: 500 });
	}
}

// Helper function to update message count
async function updateMessageCount(pool, ipAddress, dateStr) {
	const upsertQuery = `
    INSERT INTO chatbotmessagecount (ip, date, count)
    VALUES ($1, $2, 1)
    ON CONFLICT (ip, date) 
    DO UPDATE SET 
      count = chatbotmessagecount.count + 1,
      updated_at = CURRENT_TIMESTAMP
    RETURNING count
  `;

	return pool.query(upsertQuery, [ipAddress, dateStr]);
}
