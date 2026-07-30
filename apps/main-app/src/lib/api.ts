import { PUBLIC_API_BASE_URL } from '$env/static/public';

// The AI endpoints (chatbot, transcribe, speak) live in the
// FastAPI backend, not in SvelteKit. In production that's a different origin
// (Cloud Run), so paths must be absolute. Locally the base is empty and the
// Vite proxy in vite.config.js forwards the relative path to localhost:8000,
// which keeps dev same-origin and out of CORS entirely.
const BASE = PUBLIC_API_BASE_URL ?? '';

export const apiUrl = (path: string) => `${BASE}${path}`;
