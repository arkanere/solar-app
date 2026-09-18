import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // trailingSlash matches the SvelteKit app: never.
  trailingSlash: false,

  // @solar/db and @solar/validation ship TypeScript source, not a build. Next
  // has to compile them the same way it compiles this app's own files.
  transpilePackages: ['@solar/db', '@solar/validation']
};

export default nextConfig;
