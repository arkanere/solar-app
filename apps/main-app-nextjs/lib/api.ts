/**
 * The AI endpoints (chatbot, transcribe, speak) live in the FastAPI backend,
 * not in this app. In production that is a different origin (Cloud Run), so
 * NEXT_PUBLIC_API_BASE_URL makes the paths absolute. Locally it is empty and
 * the dev rewrite in next.config.ts forwards the relative path to
 * localhost:8000, which keeps dev same-origin and out of CORS.
 *
 * NEXT_PUBLIC_ values are baked in at build time: changing it needs a redeploy.
 */
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const apiUrl = (path: string) => `${BASE}${path}`;
