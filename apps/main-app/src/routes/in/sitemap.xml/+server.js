// Sitemap for /in/ routes - Generated from main sitemap with /in prefix
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function GET() {
	try {
		// Read the generated sitemap file
		const sitemapPath = join(__dirname, 'sitemap-generated.xml');
		const xml = readFileSync(sitemapPath, 'utf-8');

		return new Response(xml, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=0, s-maxage=3600'
			}
		});
	} catch (error) {
		console.error('Error reading sitemap:', error);

		// Fallback to minimal sitemap if file not found
		const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://solarvipani.com/in/</loc>
    <lastmod>2025-10-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

		return new Response(fallbackXml, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=0, s-maxage=3600'
			}
		});
	}
}
