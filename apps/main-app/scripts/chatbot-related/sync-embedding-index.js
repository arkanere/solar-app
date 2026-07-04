// Mirror live IN sitemap pages into embeddings.in_embedding_index, tagged by category.
//
// The sitemap (/in/sitemap.xml) is the single source of truth: it only lists
// pages that actually resolve, with the canonical URL form the site serves.
//
// Each CATEGORY classifies a slice of the sitemap by URL shape and assigns a
// `chunking_strategy` — the embedding strategy a downstream job uses to chunk &
// embed that kind of page. Today there is one category, `city-pages`. Adding
// blogs / guides / projects later is just another entry in CATEGORIES.
//
// Run:  node --env-file=../../.env.local sync-embedding-index.js
//
// Non-destructive: inserts new pages and refreshes last_update + chunking_strategy
// on existing ones. It does not delete rows for pages that left the sitemap, and
// never touches last_embedding_update (owned by the downstream embedding job).

import { createPool } from '@vercel/postgres';

const SITEMAP_URL = 'https://solarvipani.com/in/sitemap.xml';
const USER_AGENT = process.env.USER_AGENT;

// Category = which sitemap URLs it owns (by pathname) + the chunking strategy
// stored for those rows. Order matters: the first matching category wins, so
// list more specific patterns before broader ones.
const CATEGORIES = [
	{
		// City pages are exactly 3 path segments under /in/solar/:
		//   /in/solar/{state}/{district}/{city}/  (state hubs have 1, districts 2)
		strategy: 'city-pages',
		match: (pathname) => /^\/in\/solar\/[^/]+\/[^/]+\/[^/]+\/?$/.test(pathname)
	}
	// Future: { strategy: 'blogs', match: (p) => /^\/in\/blogs\/[^/]+\/?$/.test(p) }, ...
];

function categoryFor(pathname) {
	return CATEGORIES.find((c) => c.match(pathname))?.strategy ?? null;
}

async function fetchSitemap(url) {
	const res = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
	if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status}`);
	return res.text();
}

// Pull { loc, lastmod, strategy } from each <url> block, keeping only pages that
// match a known category.
function parseEntries(xml) {
	const entries = [];
	for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
		const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
		if (!loc) continue;
		let pathname;
		try {
			pathname = new URL(loc).pathname;
		} catch {
			continue;
		}
		const strategy = categoryFor(pathname);
		if (!strategy) continue;
		const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() || null;
		entries.push({ loc, lastmod, strategy });
	}
	return entries;
}

// Upsert all rows in one parameterized statement (well under the 65535 param cap).
async function upsertEntries(pool, entries) {
	const placeholders = entries
		.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
		.join(',');
	const params = entries.flatMap(({ loc, lastmod, strategy }) => [loc, lastmod, strategy]);
	await pool.query(
		`INSERT INTO embeddings.in_embedding_index (page_link, last_update, chunking_strategy)
		 VALUES ${placeholders}
		 ON CONFLICT (page_link) DO UPDATE
		   SET last_update = EXCLUDED.last_update,
		       chunking_strategy = EXCLUDED.chunking_strategy`,
		params
	);
}

async function main() {
	const connectionString = process.env.POSTGRES_URL;
	if (!connectionString) {
		throw new Error('POSTGRES_URL not set. Run with: node --env-file=../../.env.local sync-embedding-index.js');
	}
	if (!USER_AGENT) throw new Error('USER_AGENT not set (use --env-file=../../.env.local).');

	const xml = await fetchSitemap(SITEMAP_URL);
	const entries = parseEntries(xml);

	const byStrategy = entries.reduce((acc, e) => ((acc[e.strategy] = (acc[e.strategy] ?? 0) + 1), acc), {});
	console.log(`Parsed ${entries.length} pages from sitemap:`, byStrategy);
	if (entries.length === 0) {
		throw new Error('No matching pages parsed — aborting to avoid touching the index.');
	}

	const pool = createPool({ connectionString });
	try {
		const before = await pool.query('SELECT count(*)::int AS n FROM embeddings.in_embedding_index');
		await upsertEntries(pool, entries);
		const after = await pool.query('SELECT count(*)::int AS n FROM embeddings.in_embedding_index');

		const inserted = after.rows[0].n - before.rows[0].n;
		console.log(`Done. ${inserted} inserted, ${entries.length - inserted} refreshed. Table now holds ${after.rows[0].n} rows.`);
	} finally {
		await pool.end();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
