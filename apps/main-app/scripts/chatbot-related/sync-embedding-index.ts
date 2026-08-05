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
// Run:  npm run sync -w main-app --prefix scripts/chatbot-related
//   or: npx tsx --env-file=../../.env.local sync-embedding-index.ts
//
// Non-destructive: inserts new pages and refreshes last_update + chunking_strategy
// on existing ones. It does not delete rows for pages that left the sitemap, and
// never touches last_embedding_update (owned by the downstream embedding job).

import { createPool } from '@vercel/postgres';
import { createDb, schema } from '@solar/db';
import { sql } from 'drizzle-orm';

const SITEMAP_URL = 'https://solarvipani.com/in/sitemap.xml';
const USER_AGENT = process.env.USER_AGENT;

interface Category {
	strategy: string;
	match: (pathname: string) => boolean;
}

// Category = which sitemap URLs it owns (by pathname) + the chunking strategy
// stored for those rows. Order matters: the first matching category wins, so
// list more specific patterns before broader ones.
const CATEGORIES: Category[] = [
	{
		// City pages are exactly 3 path segments under /in/solar/:
		//   /in/solar/{state}/{district}/{city}/  (state hubs have 1, districts 2)
		strategy: 'city-pages',
		match: (pathname) => /^\/in\/solar\/[^/]+\/[^/]+\/[^/]+\/?$/.test(pathname)
	}
	// Future: { strategy: 'blogs', match: (p) => /^\/in\/blogs\/[^/]+\/?$/.test(p) }, ...
];

function categoryFor(pathname: string): string | null {
	return CATEGORIES.find((c) => c.match(pathname))?.strategy ?? null;
}

async function fetchSitemap(url: string): Promise<string> {
	const res = await fetch(url, { headers: { 'user-agent': USER_AGENT as string } });
	if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status}`);
	return res.text();
}

interface SitemapEntry {
	loc: string;
	lastmod: string | null;
	strategy: string;
}

// Pull { loc, lastmod, strategy } from each <url> block, keeping only pages that
// match a known category.
function parseEntries(xml: string): SitemapEntry[] {
	const entries: SitemapEntry[] = [];
	for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
		const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
		if (!loc) continue;
		let pathname: string;
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

type Db = ReturnType<typeof createDb>;

// Upsert all rows in one statement (well under the 65535 param cap). Drizzle
// builds the multi-row VALUES list and the placeholders that used to be
// hand-numbered here.
async function upsertEntries(db: Db, entries: SitemapEntry[]): Promise<void> {
	await db
		.insert(schema.inEmbeddingIndex)
		.values(
			entries.map(({ loc, lastmod, strategy }) => ({
				pageLink: loc,
				lastUpdate: lastmod,
				chunkingStrategy: strategy
			}))
		)
		.onConflictDoUpdate({
			target: schema.inEmbeddingIndex.pageLink,
			set: {
				lastUpdate: sql`excluded.last_update`,
				chunkingStrategy: sql`excluded.chunking_strategy`
			}
		});
}

async function countRows(db: Db): Promise<number> {
	const [row] = await db
		.select({ n: sql<number>`count(*)::int` })
		.from(schema.inEmbeddingIndex);
	return row.n;
}

async function main(): Promise<void> {
	const connectionString = process.env.POSTGRES_URL;
	if (!connectionString) {
		throw new Error(
			'POSTGRES_URL not set. Run with: npx tsx --env-file=../../.env.local sync-embedding-index.ts'
		);
	}
	if (!USER_AGENT) throw new Error('USER_AGENT not set (use --env-file=../../.env.local).');

	const xml = await fetchSitemap(SITEMAP_URL);
	const entries = parseEntries(xml);

	const byStrategy = entries.reduce<Record<string, number>>(
		(acc, e) => ((acc[e.strategy] = (acc[e.strategy] ?? 0) + 1), acc),
		{}
	);
	console.log(`Parsed ${entries.length} pages from sitemap:`, byStrategy);
	if (entries.length === 0) {
		throw new Error('No matching pages parsed — aborting to avoid touching the index.');
	}

	const pool = createPool({ connectionString });
	const db = createDb(pool);
	try {
		const before = await countRows(db);
		await upsertEntries(db, entries);
		const after = await countRows(db);

		const inserted = after - before;
		console.log(
			`Done. ${inserted} inserted, ${entries.length - inserted} refreshed. Table now holds ${after} rows.`
		);
	} finally {
		await pool.end();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
