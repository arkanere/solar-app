import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // trailingSlash matches the SvelteKit app: never.
  trailingSlash: false,

  // @solar/db ships TypeScript source, not a build. Next has to compile it the
  // same way it compiles this app's own files.
  transpilePackages: ['@solar/db']
};

export default nextConfig;
