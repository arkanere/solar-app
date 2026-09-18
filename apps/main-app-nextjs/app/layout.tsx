import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BASE_URL } from '@/lib/directory/structuredData';
import { SITE_NAME } from '@/lib/metadata';
import './globals.css';

// Sans carries the directory surface — 90% of URLs — and every UI affordance.
// Variable font, so weight 400-700 costs one file.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

/**
 * Site defaults. Every page that builds its own metadata does it through
 * `pageMetadata` in lib/metadata.ts; this is what the pages that have none
 * yet — the 44 route stubs — fall back to.
 *
 * `metadataBase` is the reason a page can pass a relative `path` as its
 * canonical: Next resolves the canonical and `og:url` against it. Without it
 * both come out pointing at localhost in every environment.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE_NAME,
  description:
    'Find verified solar panel installers, compare quotes and go solar. Solar Vipani lists installers across India and the United States.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
