import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Local dev: the AI chatbot + speech endpoints are served by the FastAPI
// backend (solar-agent-backend, `uv run uvicorn app.main:app --reload`).
// The proxy rewrites /in/api/<name> -> http://localhost:8000/api/<name> so no
// frontend fetch call needs to change. Endpoints NOT listed here (submitLead,
// submitBusiness, ...) keep hitting the SvelteKit routes.
const FASTAPI_BACKEND = 'http://localhost:8000';
const backendProxy = (name) => ({
	target: FASTAPI_BACKEND,
	changeOrigin: true,
	rewrite: () => `/api/${name}`
});

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/in/api/chatbot': backendProxy('chatbot'),
			'/in/api/transcribe': backendProxy('transcribe'),
			'/in/api/speak': backendProxy('speak'),
			'/in/api/generate-cad': backendProxy('generate-cad')
		}
	}
});
