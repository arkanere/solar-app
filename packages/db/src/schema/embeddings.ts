// HAND-MAINTAINED — unlike schema.ts and relations.ts, this file is not
// generated and `npm run pull -w @solar/db` will not touch it.
//
// Why it has to be hand-written: drizzle.config.ts sets `schemaFilter: ['public']`,
// so introspection never sees the `embeddings` Postgres schema. Widening the
// filter would pull the whole schema into the generated file and change what
// every app compiles against; this table is used by two offline scripts only.
//
// Scope is deliberately minimal: the columns
// apps/main-app/scripts/chatbot-related/*.ts actually read and write, and
// nothing else. The `embeddings` schema is owned outside the numbered SQL
// migrations, so if a script starts touching another column, add it here by
// checking the live table — do not assume this is the full row.

import { pgSchema, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const embeddingsSchema = pgSchema('embeddings');

/**
 * The RAG chatbot's embedding queue. A page is stale — and gets (re)embedded —
 * when `lastEmbeddingUpdate IS NULL OR lastEmbeddingUpdate < lastUpdate`.
 */
export const inEmbeddingIndex = embeddingsSchema.table('in_embedding_index', {
	// serial, not plain integer: neither script ever supplies an id, so the
	// live column must default from a sequence.
	id: serial().primaryKey().notNull(),
	pageLink: text('page_link').notNull(),
	lastUpdate: timestamp('last_update', { mode: 'string' }),
	chunkingStrategy: text('chunking_strategy'),
	lastEmbeddingUpdate: timestamp('last_embedding_update', { mode: 'string' })
});
