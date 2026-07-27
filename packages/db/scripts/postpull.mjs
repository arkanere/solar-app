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

writeFileSync(schemaPath, lines.join('\n'));
console.log(`postpull: removed ${dropped} unused \`table\` parameter(s)`);
