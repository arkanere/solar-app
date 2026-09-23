import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BASE_URL } from '@/lib/directory/structuredData';
import { OG_IMAGE, SITE_NAME } from '@/lib/metadata';
import { Umami } from '@/components/analytics/Umami';
import './globals.css';

// Sans carries the directory surface — 90% of URLs — and every UI affordance.
// Variable font, so weight 400-700 costs one file.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const DESCRIPTION =
  'Find verified solar panel installers, compare quotes and go solar. Solar Vipani lists installers across India and the United States.';

/**
 * Site defaults. Every page that builds its own metadata does it through
 * `pageMetadata` in lib/metadata.ts; this is what the pages that have none
 * yet — the 44 route stubs — fall back to.
 *
 * `metadataBase` is the reason a page can pass a relative `path` as its
 * canonical: Next resolves the canonical and `og:url` against it. Without it
 * both come out pointing at localhost in every environment.
 *
 * The share card is here as well as in `pageMetadata`, and that duplication
 * is the point: a stub with no metadata of its own still shares as the site
 * rather than as a bare link. It is the same `logo.webp` the live site uses —
 * see lib/metadata.ts for why it is a logo and not a 1200x630 card.
 *
 * The icons are NOT declared here. Next generates those tags from
 * app/favicon.ico, app/icon.png and app/apple-icon.png; naming them again
 * would emit each one twice.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE_NAME,
  description: DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: SITE_NAME }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@solarvipani',
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [OG_IMAGE.url]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Umami />
      </body>
    </html>
  );
}
