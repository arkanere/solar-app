import { defineConfig, type Plugin } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Loads every .svelte import as an empty module.
//
// Nothing in this suite renders a component — it tests server code. But some
// $lib barrels re-export a component alongside their server helpers (notably
// $lib/compliance, which claimLead imports for checkLeadDataPolicy), so the
// import has to resolve to *something* or the barrel fails to load.
//
// The real @sveltejs/vite-plugin-svelte is not usable here: its configureServer
// hook throws under Vitest because the monorepo resolves two different Vite
// versions. Compiling the components would buy nothing anyway.
const stubSvelteComponents: Plugin = {
	name: 'stub-svelte-components',
	enforce: 'pre',
	load(id) {
		if (id.endsWith('.svelte')) return 'export default function StubComponent() {}';
	}
};

const src = fileURLToPath(new URL('./src', import.meta.url));
const tests = fileURLToPath(new URL('./tests', import.meta.url));

export default defineConfig({
	plugins: [stubSvelteComponents],
	resolve: {
		// Order matters — Vite takes the first matching alias, so the exact-match
		// db.ts swap has to precede the general $lib prefix rule.
		alias: [
			{ find: /^\$lib\/server\/db$/, replacement: `${tests}/setup/testDb.ts` },
			{ find: /^\$env\/static\/private$/, replacement: `${tests}/setup/env.ts` },
			{ find: /^\$env\/dynamic\/private$/, replacement: `${tests}/setup/envDynamic.ts` },
			{ find: /^\$lib/, replacement: src + '/lib' },
			{ find: /^\$app\/environment$/, replacement: `${tests}/setup/appEnvironment.ts` }
		]
	},
	test: {
		include: ['tests/**/*.test.ts'],
		globalSetup: ['tests/setup/globalSetup.ts'],
		setupFiles: ['tests/setup/setupFile.ts'],
		// One process, one test at a time. The suite shares a single database and
		// several tests assert on absolute row counts, so parallelism would make
		// them flaky for reasons that have nothing to do with the code under test.
		// The concurrency that *is* under test (claimLead's FOR UPDATE) is driven
		// explicitly inside a single test via two pool connections.
		pool: 'forks',
		poolOptions: { forks: { singleFork: true } },
		fileParallelism: false,
		testTimeout: 20000,
		hookTimeout: 120000
	}
});
