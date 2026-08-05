// Runs after `drizzle-kit pull`, which is not quite tidy enough to hand to a
// strict tsconfig:
//
// 1. It emits a snapshot .sql + meta/ next to the schema. The numbered SQL
//    migrations in apps/main-app are the source of truth, so those are noise.
// 2. For tables whose only extra config is a raw-SQL check() constraint, it
//    emits `(table) => [ ... ]` without ever referencing `table`. main-app
//    compiles with noUnusedParameters, so that is a hard error in every app
//    that imports the schema. Drop the parameter where it is genuinely unused.

import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const schemaDir = new URL('../src/schema/', import.meta.url).pathname;

for (const entry of readdirSync(schemaDir)) {
	if (entry.endsWith('.sql') || entry === 'meta') {
		rmSync(join(schemaDir, entry), { recursive: true, force: true });
	}
}

const schemaPath = join(schemaDir, 'schema.ts');
const lines = readFileSync(schemaPath, 'utf8').split('\n');
let dropped = 0;

for (let i = 0; i < lines.length; i++) {
	if (lines[i] !== '}, (table) => [') continue;

	let end = i + 1;
	while (end < lines.length && lines[end] !== ']);') end++;

	const body = lines.slice(i + 1, end).join('\n');
	if (!body.includes('table.')) {
		lines[i] = '}, () => [';
		dropped++;
	}
}

// 3. Composite foreign keys come out with the two sides in different orders.
//
//    drizzle-kit lists `columns` in the *local* table's column order but
//    `foreignColumns` in the *referenced* table's column order. foreignKey()
//    pairs them positionally, so whenever those orders disagree the emitted
//    constraint is wrong. For legal_acceptances that means
//    business_id -> country_code (integer -> char(2)), which Postgres rejects
//    outright — it breaks `scripts/generate-test-baseline.mjs`, so the whole
//    integration suite fails to build its schema.
//
//    The fix is to reorder the local `columns` to match `foreignColumns`.
//    Keyed by constraint name because the correct pairing lives in the
//    database, not in the emitted file: if another composite FK is ever added,
//    check `pg_get_constraintdef` for it and add an entry here.
const COMPOSITE_FK_COLUMN_ORDER = {
	// LIVE: FOREIGN KEY (country_code, business_id)
	//       REFERENCES business_accounts(country_code, source_id)
	legal_acceptances_business_fkey: ['table.countryCode', 'table.businessId']
};

let reordered = 0;
let src = lines.join('\n');

// One foreignKey({...}) block at a time, so a match can never span two of them.
src = src.replace(/foreignKey\(\{[\s\S]*?\}\)/g, (block) => {
	const name = block.match(/name: "([^"]+)"/)?.[1];
	const order = name && COMPOSITE_FK_COLUMN_ORDER[name];
	if (!order) return block;

	const cols = block.match(/columns: \[([^\]]*)\]/)?.[1] ?? '';
	const wanted = order.join(', ');
	if (cols.trim() === wanted) return block;

	// Only reorder — never add or drop a column.
	const present = cols.split(',').map((c) => c.trim()).sort().join('|');
	if (present !== [...order].sort().join('|')) {
		throw new Error(
			`postpull: ${name} columns [${cols.trim()}] are not a reordering of ` +
				`[${wanted}]. The schema changed — update COMPOSITE_FK_COLUMN_ORDER.`
		);
	}
	reordered++;
	return block.replace(/columns: \[[^\]]*\]/, `columns: [${wanted}]`);
});

writeFileSync(schemaPath, src);
console.log(
	`postpull: removed ${dropped} unused \`table\` parameter(s), ` +
		`reordered ${reordered} composite foreign key(s)`
);
