// Embed IN city pages into the Pinecone index `solar-vipani-knowledge`, which
// powers the RAG chatbot. Handles only the `city-pages` chunking_strategy.
//
// embeddings.in_embedding_index is the queue. A city page is stale — and gets
// (re)embedded — when it was never embedded or its source changed since:
//
//     last_embedding_update IS NULL OR last_embedding_update < last_update
//
// Content = the installer directory only. Everything else on a city page (the
// subsidy table, generic FAQ) is identical across all 2,383 pages, so it is NOT
// embedded here; it belongs in a one-off knowledge doc, not duplicated per city.
// We read the page's own LocalBusiness + BreadcrumbList JSON-LD (clean, no DOM
// scraping) and build one chunk per city.
//
// Vector IDs are "{index_id}#{chunk_index}". All chunks of a page share the
// prefix "{index_id}#", so re-embedding lists that prefix, deletes the old
// chunks, and upserts fresh ones — no stale vectors, no Postgres/Pinecone drift.
// Postgres owns freshness: a page is stamped last_embedding_update only after its
// chunks land in Pinecone.
//
// Run:  node --env-file=../../.env.local embed-city-pages.js [--limit N] [--dry-run] [--base URL]
//   --limit N   process at most N pending pages (handy for a test batch)
//   --dry-run   fetch + extract + log, but never embed, upsert, or stamp
//   --base URL  fetch from this origin instead of the page's (e.g. http://localhost:7123).
//               source_url metadata always stays the canonical page_link.

import { createPool } from '@vercel/postgres';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';

const USER_AGENT = process.env.USER_AGENT;
const INDEX_NAME = 'solar-vipani-knowledge';
const STRATEGY = 'city-pages';
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims — matches the index

const BATCH_SIZE = 50; // pages per embed+upsert round
const FETCH_CONCURRENCY = 8;

// --- Extract -----------------------------------------------------------------

// Parse every <script type="application/ld+json"> block from the page.
function parseJsonLd(html) {
	const out = [];
	for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
		try {
			out.push(JSON.parse(m[1]));
		} catch {
			// skip malformed blocks
		}
	}
	return out;
}

// Build one chunk (or none) from a city page's HTML. Returns null when the page
// has no usable installer data, so the caller skips it without stamping.
function extractCityChunk(html) {
	const blocks = parseJsonLd(html);
	const crumb = blocks.find((b) => b['@type'] === 'BreadcrumbList');
	const businesses = blocks.filter((b) => b['@type'] === 'LocalBusiness');
	if (!crumb || businesses.length === 0) return null;

	// Breadcrumb positions: 3=state, 4=district, 5=city (after Home, Solar).
	const byPos = Object.fromEntries((crumb.itemListElement ?? []).map((it) => [it.position, it.name]));
	const state = byPos[3];
	const district = byPos[4];
	const city = byPos[5];
	if (!city || !district || !state) return null;

	const lines = businesses.map((b, i) => {
		const addr = b.address?.streetAddress?.trim();
		const phone = b.telephone?.trim();
		const parts = [`${i + 1}. ${b.name}`];
		if (addr) parts.push(addr);
		if (phone) parts.push(`phone ${phone}`);
		return parts.join(' — ');
	});

	const text =
		`Solar panel installers in ${city}, ${district} district, ${state}, India. ` +
		`${businesses.length} verified solar installer${businesses.length > 1 ? 's' : ''} ` +
		`serving ${city} and the ${district} area:\n${lines.join('\n')}`;

	return { text, title: `Solar Panel Installers in ${city}, ${district}`, city, district, state };
}

// --- Fetch -------------------------------------------------------------------

async function fetchHtml(url) {
	const res = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.text();
}

// Resolve the URL we actually fetch: honor --base by swapping the origin, while
// keeping the canonical page_link for source_url metadata.
function fetchUrlFor(pageLink, base) {
	if (!base) return pageLink;
	const u = new URL(pageLink);
	const b = new URL(base);
	u.protocol = b.protocol;
	u.host = b.host;
	return u.toString();
}

async function mapPool(items, concurrency, fn) {
	const results = new Array(items.length);
	let next = 0;
	async function worker() {
		while (next < items.length) {
			const i = next++;
			results[i] = await fn(items[i]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
	return results;
}

// --- Pinecone ----------------------------------------------------------------

// List + delete every vector whose ID starts with `prefix` (a page's chunks).
async function deleteByPrefix(index, prefix) {
	const ids = [];
	let paginationToken;
	do {
		const res = await index.listPaginated({ prefix, paginationToken });
		for (const v of res.vectors ?? []) ids.push(v.id);
		paginationToken = res.pagination?.next;
	} while (paginationToken);
	if (ids.length) await index.deleteMany(ids);
}

// --- Main --------------------------------------------------------------------

function parseArgs(argv) {
	const args = { limit: null, dryRun: false, base: null };
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--limit') args.limit = parseInt(argv[++i], 10);
		else if (argv[i] === '--dry-run') args.dryRun = true;
		else if (argv[i] === '--base') args.base = argv[++i];
	}
	return args;
}

async function main() {
	const args = parseArgs(process.argv.slice(2));

	if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL not set (use --env-file=../../.env.local).');
	if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set.');
	if (!process.env.PINECONE_API_KEY) throw new Error('PINECONE_API_KEY not set.');
	if (!USER_AGENT) throw new Error('USER_AGENT not set (use --env-file=../../.env.local).');

	const pool = createPool({ connectionString: process.env.POSTGRES_URL });

	const { rows: pending } = await pool.query(
		`SELECT id, page_link
		   FROM embeddings.in_embedding_index
		  WHERE chunking_strategy = $1
		    AND (last_embedding_update IS NULL OR last_embedding_update < last_update)
		  ORDER BY id
		  ${args.limit ? `LIMIT ${args.limit}` : ''}`,
		[STRATEGY]
	);

	console.log(
		`${pending.length} pending city page(s)` +
			(args.limit ? ` (capped at --limit ${args.limit})` : '') +
			(args.dryRun ? ' [DRY RUN]' : '')
	);
	if (pending.length === 0) {
		await pool.end();
		return;
	}

	const embeddings = new OpenAIEmbeddings({
		openAIApiKey: process.env.OPENAI_API_KEY,
		modelName: EMBEDDING_MODEL
	});
	const index = new Pinecone({ apiKey: process.env.PINECONE_API_KEY }).index(INDEX_NAME);

	let embedded = 0;
	let skipped = 0;
	let failed = 0;

	for (let start = 0; start < pending.length; start += BATCH_SIZE) {
		const batch = pending.slice(start, start + BATCH_SIZE);

		// 1. Fetch + extract each page (concurrently). chunk: object | null (no
		//    content) | undefined (fetch/extract failed — retry on a later run).
		const extracted = await mapPool(batch, FETCH_CONCURRENCY, async (row) => {
			try {
				const html = await fetchHtml(fetchUrlFor(row.page_link, args.base));
				return { row, chunk: extractCityChunk(html) };
			} catch (err) {
				console.warn(`  ! ${row.page_link} — ${err.message}`);
				return { row, chunk: undefined };
			}
		});

		// 2. Keep pages that produced a chunk.
		const records = [];
		for (const { row, chunk } of extracted) {
			if (chunk === undefined) failed++;
			else if (chunk === null) skipped++;
			else records.push({ row, chunk });
		}
		if (records.length === 0) continue;

		if (args.dryRun) {
			for (const { row, chunk } of records.slice(0, 3)) {
				console.log(`\n--- ${row.id}#0 (${row.page_link}) ---\n${chunk.text}`);
			}
			embedded += records.length;
			continue;
		}

		// 3. Embed all chunk texts in one call.
		const vectors = await embeddings.embedDocuments(records.map((r) => r.chunk.text));

		// 4. Build Pinecone records (one chunk per city → chunk_index 0 of 1).
		const upserts = records.map(({ row, chunk }, i) => ({
			id: `${row.id}#0`,
			values: vectors[i],
			metadata: {
				text: chunk.text,
				source_url: row.page_link,
				title: chunk.title,
				content_type: STRATEGY,
				index_id: Number(row.id),
				chunk_index: 0,
				total_chunks: 1,
				indexed_at: new Date().toISOString(),
				city: chunk.city,
				district: chunk.district,
				state: chunk.state
			}
		}));

		// 5. Clear any prior chunks for these pages, then upsert.
		const ids = records.map(({ row }) => row.id);
		await Promise.all(ids.map((id) => deleteByPrefix(index, `${id}#`)));
		await index.upsert(upserts);

		// 6. Stamp freshness for pages that successfully landed.
		await pool.query(
			`UPDATE embeddings.in_embedding_index SET last_embedding_update = now() WHERE id = ANY($1)`,
			[ids]
		);

		embedded += records.length;
		console.log(`  batch ${start / BATCH_SIZE + 1}: embedded ${records.length} page(s)`);
	}

	console.log(`\nDone. Embedded ${embedded}, skipped ${skipped} (no content), failed ${failed}.`);
	await pool.end();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
