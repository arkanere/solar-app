import type { NextConfig } from 'next';

// The chatbot's AI endpoints live in the FastAPI backend. In dev they are
// forwarded there so the browser stays same-origin; in production the client
// calls NEXT_PUBLIC_API_BASE_URL directly (lib/api.ts). The other /api routes
// are this app's own and are not listed.
const FASTAPI_BACKEND = 'http://localhost:8000';
const BACKEND_PATHS = ['/api/chatbot', '/api/transcribe', '/api/speak'];

const nextConfig: NextConfig = {
  // trailingSlash matches the SvelteKit app: never.
  trailingSlash: false,

  // @solar/db and @solar/validation ship TypeScript source, not a build. Next
  // has to compile them the same way it compiles this app's own files.
  transpilePackages: ['@solar/db', '@solar/validation'],

  // Every <Image> in the app resolves through one module. A loaderFile rather
  // than a `loader` prop because a function prop cannot cross the server
  // boundary, and almost every image here is rendered by a server component.
  // Next's own optimiser is out of the path entirely — a custom loader returns
  // a URL and Next fetches nothing — so no remotePatterns are needed and
  // Cloudinary stays the optimiser. See lib/cloudinary-loader.ts.
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.ts'
  },

  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return [];
    return BACKEND_PATHS.map((path) => ({
      source: path,
      destination: `${FASTAPI_BACKEND}${path}`
    }));
  }
};

export default nextConfig;
