import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Local dev: the AI chatbot + speech endpoints are served by the FastAPI
// backend (solar-agent-backend, `uv run uvicorn app.main:app --reload`).
// In production these are absolute URLs built from PUBLIC_API_BASE_URL (see
// $lib/api); locally that base is empty, so the paths stay relative and this
// proxy forwards them to localhost:8000 — same-origin, so no CORS is involved.
// Endpoints NOT listed here (submitLead, submitBusiness, ...) keep hitting the
// SvelteKit routes.
const FASTAPI_BACKEND = 'http://localhost:8000';
const backendProxy = {
	target: FASTAPI_BACKEND,
	changeOrigin: true
};

export default defineConfig({
	plugins: [sveltekit()],
	// @solar/db and @solar/validation ship TypeScript source (workspace
	// packages), so they must be bundled rather than externalized into the
	// SSR/serverless output.
	ssr: {
		noExternal: ['@solar/db', '@solar/validation']
	},
	server: {
		proxy: {
			'/api/chatbot': backendProxy,
			'/api/transcribe': backendProxy,
			'/api/speak': backendProxy,
			'/api/generate-cad': backendProxy
		}
	}
});
