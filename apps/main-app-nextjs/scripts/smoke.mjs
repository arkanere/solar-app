/**
 * The smoke harness: one URL of every route shape, asserting the status it is
 * supposed to answer with.
 *
 * It is not a test suite. It checks that a route still answers and that the
 * cached ones are still cached. Nothing about content, layout or correctness.
 *
 * ## Why a header check and not a timer
 *
 * The failure this exists to catch is silent. `export const revalidate = N`
 * without `generateStaticParams` renders a dynamic route `ƒ`: the page looks
 * identical and re-queries the database on every request. Both README "rules
 * that break the build" are invisible in the HTML and visible in the headers.
 *
 * On Vercel the signal is `x-vercel-cache`; `next start` emits `x-nextjs-cache`
 * instead, so both are accepted. A cold ISR page answers MISS on its first
 * visit exactly like a dynamic one, so presence of the header proves nothing:
 * the discriminator is the SECOND request. Cached routes go to HIT/STALE and
 * dynamic routes stay MISS. That is why the ISR shapes are requested twice.
 * Vercel strips `s-maxage` from the response, so cache-control cannot be read
 * for this instead.
 *
 * The second request is retried, because Vercel's cache write is not visible
 * to a request that follows immediately: a cold page measured MISS, MISS, then
 * HIT, HIT, HIT a few seconds later. Without the backoff 16 of the 48 cached
 * shapes fail on a cold deploy and the run is a coin toss. A route that is
 * genuinely uncached still fails — it just takes CACHE_RETRIES attempts to say so.
 *
 * ## Why the URLs are literals
 *
 * Every dynamic shape needs a real row in its URL. Resolving those from the
 * database would duplicate the queries in lib/directory/data.ts and drag a DB
 * connection into a script whose whole point is that it only speaks HTTP. So
 * the samples below are literals, taken from the live sitemaps on 2026-09-22.
 * The cost is that deleting one of these 24 rows breaks a line here; the fix
 * is to swap in another slug. Add a shape in the same commit that adds a route.
 *
 * ## Why nothing is POSTed
 *
 * The default target is production. A POST to /api/submitLead writes a lead; a
 * POST to /api/unsubscribe opts a real address out. So the eight write
 * endpoints are checked by the one thing that proves the handler is mounted
 * without it doing any work: a GET, which Next answers 405 because the module
 * exports no GET. It does not exercise the body validation, and is not meant to.
 *
 *   node scripts/smoke.mjs
 *   BASE_URL=http://localhost:7124 node scripts/smoke.mjs
 *   node scripts/smoke.mjs --verbose
 */

const BASE_URL = (process.env.BASE_URL ?? 'https://solar-app-main-app-nextjs.vercel.app').replace(
  /\/+$/,
  ''
);
const VERBOSE = process.argv.includes('--verbose');
const CONCURRENCY = Number(process.env.SMOKE_CONCURRENCY ?? 8);

/**
 * One entry per route shape.
 *
 *   shape    the pattern, as routes.md writes it — the coverage list
 *   url      a concrete sample of it
 *   status   what it must answer (default 200)
 *   location where a 3xx must point, path-only
 *   isr      request twice; the second must be served from the cache
 *   note     why this shape is not a plain 200
 */
const SHAPES = [
  // ---- Editorial and root pages -------------------------------------------
  { shape: '/', url: '/', isr: true },
  { shape: '/about-us', url: '/about-us', isr: true },
  { shape: '/terms-of-use', url: '/terms-of-use' },
  { shape: '/privacy-policy', url: '/privacy-policy' },
  { shape: '/data-deletion', url: '/data-deletion' },
  { shape: '/data-access', url: '/data-access' },
  { shape: '/write-for-us', url: '/write-for-us' },
  { shape: '/unsubscribe', url: '/unsubscribe', note: 'noindex, reached from a mailed link' },
  { shape: '/tools', url: '/tools', isr: true },
  { shape: '/tools/solar-calculator', url: '/tools/solar-calculator', isr: true },
  { shape: '/tools/emi-calculator', url: '/tools/emi-calculator', isr: true },
  { shape: '/tools/subsidy-checker', url: '/tools/subsidy-checker', isr: true },

  // ---- The seven pillars, landing and cluster ------------------------------
  { shape: '/rooftop-solar', url: '/rooftop-solar', isr: true },
  { shape: '/rooftop-solar/{slug}', url: '/rooftop-solar/10kw-system', isr: true },
  { shape: '/solar-panels', url: '/solar-panels', isr: true },
  { shape: '/solar-panels/{slug}', url: '/solar-panels/bifacial', isr: true },
  { shape: '/solar-inverters', url: '/solar-inverters', isr: true },
  { shape: '/solar-inverters/{slug}', url: '/solar-inverters/for-commercial', isr: true },
  { shape: '/solar-pumps', url: '/solar-pumps', isr: true },
  { shape: '/solar-pumps/{slug}', url: '/solar-pumps/10hp', isr: true },
  { shape: '/solar-subsidy', url: '/solar-subsidy', isr: true },
  { shape: '/solar-subsidy/{slug}', url: '/solar-subsidy/application-process', isr: true },
  { shape: '/solar-financing', url: '/solar-financing', isr: true },
  { shape: '/solar-financing/{slug}', url: '/solar-financing/commercial-financing', isr: true },
  { shape: '/solar-installation', url: '/solar-installation', isr: true },
  { shape: '/solar-installation/{slug}', url: '/solar-installation/checklist', isr: true },

  // ---- Stubs. 200 today because the page is a placeholder, not because the
  //      route works. `solar_products` and `authors` are empty; when a row
  //      lands these become real pages and these lines stay as they are.
  {
    shape: '/solar-panels/{brand}/{model}',
    url: '/solar-panels/bifacial/some-model',
    note: 'stub — solar_products is empty'
  },
  {
    shape: '/solar-inverters/{brand}/{model}',
    url: '/solar-inverters/for-commercial/some-model',
    note: 'stub — solar_products is empty'
  },
  {
    shape: '/solar-pumps/{brand}/{model}',
    url: '/solar-pumps/10hp/some-model',
    note: 'stub — solar_products is empty'
  },
  { shape: '/authors/{slug}', url: '/authors/someone', note: 'stub — authors is empty' },

  // ---- Directory, both countries -------------------------------------------
  { shape: '/in/solar', url: '/in/solar', isr: true },
  { shape: '/us/solar', url: '/us/solar', isr: true },
  { shape: '/in/solar/{state}', url: '/in/solar/andhra-pradesh', isr: true },
  { shape: '/us/solar/{state}', url: '/us/solar/arizona', isr: true },
  { shape: '/in/solar/{state}/{district}', url: '/in/solar/andhra-pradesh/palnadu', isr: true },
  { shape: '/us/solar/{state}/{district}', url: '/us/solar/arizona/maricopa', isr: true },
  {
    shape: '/in/solar/{state}/{district}/{city}',
    url: '/in/solar/andhra-pradesh/palnadu/narasaraopet',
    isr: true
  },
  {
    shape: '/us/solar/{state}/{district}/{city}',
    url: '/us/solar/arizona/maricopa/tempe',
    isr: true
  },
  { shape: '/in/installer/{slug}', url: '/in/installer/2k-technologies-kondotty', isr: true },
  {
    shape: '/us/installer/{slug}',
    url: '/us/installer/el-dorado-solar-dudes-el-dorado-hills',
    isr: true
  },

  // ---- Projects. IN only: /us/recent-solar-installation-projects is a 404 by
  //      design (routes.md), and that 404 is itself a shape worth asserting.
  {
    shape: '/in/recent-solar-installation-projects',
    url: '/in/recent-solar-installation-projects',
    isr: true
  },
  {
    shape: '/in/recent-solar-installation-projects/{page}',
    url: '/in/recent-solar-installation-projects/2',
    isr: true
  },
  {
    shape: '/us/recent-solar-installation-projects',
    url: '/us/recent-solar-installation-projects',
    status: 404,
    note: 'IN only — the 404 is the contract'
  },
  {
    shape: '/in/project/{project_id}',
    url: '/in/project/5kw-residential-solar-installation-with-78-000-subsidy-under-pm-surya-ghar-yojana-at-tiruchirappalli-es9ewy',
    isr: true
  },

  // ---- Lead and acquisition surfaces ---------------------------------------
  { shape: '/in/business-form', url: '/in/business-form', isr: true },
  { shape: '/us/business-form', url: '/us/business-form', isr: true },
  { shape: '/in/business-listing', url: '/in/business-listing', isr: true },
  { shape: '/us/business-listing', url: '/us/business-listing', isr: true },
  { shape: '/in/partners', url: '/in/partners', isr: true },
  { shape: '/in/partners/join', url: '/in/partners/join', isr: true },
  { shape: '/in/partners/join/{district}', url: '/in/partners/join/palnadu', isr: true },
  { shape: '/in/partners/join/thank-you', url: '/in/partners/join/thank-you', isr: true },
  { shape: '/in/get-quotes', url: '/in/get-quotes', isr: true },
  { shape: '/in/thank-you', url: '/in/thank-you', note: 'reached from the confirmation email' },
  { shape: '/in/thank-you-business', url: '/in/thank-you-business', isr: true },
  { shape: '/us/thank-you-business', url: '/us/thank-you-business', isr: true },

  // ---- Sitemaps -------------------------------------------------------------
  { shape: '/sitemap.xml', url: '/sitemap.xml', isr: true },
  { shape: '/in/sitemap.xml', url: '/in/sitemap.xml', isr: true },
  { shape: '/us/sitemap.xml', url: '/us/sitemap.xml', isr: true },
  { shape: '/content-sitemap.xml', url: '/content-sitemap.xml', isr: true },

  // ---- Read endpoints -------------------------------------------------------
  { shape: '/api/stories', url: '/api/stories' },
  {
    shape: '/{cc}/api/getCities',
    url: '/in/api/getCities?state=andhra-pradesh&level2=palnadu'
  },
  { shape: '/{cc}/api/getLevel2s', url: '/in/api/getLevel2s?state=andhra-pradesh' },

  // ---- Write endpoints. GET only: see the header. 405 proves the module is
  //      mounted and exports no GET, and writes nothing.
  { shape: '/api/unsubscribe', url: '/api/unsubscribe', status: 405, note: 'POST-only' },
  { shape: '/api/submitDataAccess', url: '/api/submitDataAccess', status: 405, note: 'POST-only' },
  {
    shape: '/api/submitDataDeletion',
    url: '/api/submitDataDeletion',
    status: 405,
    note: 'POST-only'
  },
  { shape: '/{cc}/api/submitLead', url: '/in/api/submitLead', status: 405, note: 'POST-only' },
  {
    shape: '/{cc}/api/submitBusiness',
    url: '/in/api/submitBusiness',
    status: 405,
    note: 'POST-only'
  },
  {
    shape: '/{cc}/api/sendLeadSubmissionConfirmation',
    url: '/in/api/sendLeadSubmissionConfirmation',
    status: 405,
    note: 'POST-only'
  },
  {
    shape: '/{cc}/api/sendBusinessSubmissionConfirmation',
    url: '/in/api/sendBusinessSubmissionConfirmation',
    status: 405,
    note: 'POST-only'
  },
  {
    shape: '/{cc}/api/generateUserMagicLink',
    url: '/in/api/generateUserMagicLink',
    status: 405,
    note: 'POST-only'
  },

  // ---- Geo shims. Route handlers, not middleware, because each needs a
  //      database lookup — which is why they drop the query string.
  {
    shape: '/in/district/{district_slug}',
    url: '/in/district/palnadu',
    status: 301,
    location: '/in/solar/andhra-pradesh/palnadu'
  },
  {
    shape: '/us/county/{county_slug}',
    url: '/us/county/maricopa-az',
    status: 301,
    location: '/us/solar/arizona/maricopa'
  },
  {
    shape: '/us/solar-panel-installer-directory/{city}',
    url: '/us/solar-panel-installer-directory/tempe-az',
    status: 301,
    location: '/us/solar/arizona/maricopa/tempe'
  },
  {
    shape: '/rooftop-solar/roi',
    url: '/rooftop-solar/roi',
    status: 301,
    location: '/solar-financing/roi'
  },

  // ---- middleware.ts. One line per rule in legacyRedirect, in its order, so
  //      this block reads as that function's coverage.
  {
    shape: 'middleware /business/*',
    url: '/business/foo',
    status: 301,
    location: 'https://business.solarvipani.com/foo'
  },
  { shape: 'middleware /in', url: '/in', status: 301, location: '/' },
  { shape: 'middleware /us', url: '/us', status: 301, location: '/' },
  { shape: 'middleware /us/state', url: '/us/state', status: 301, location: '/us/solar' },
  {
    shape: 'middleware /us/state/solar-panel-installers-in-{state}',
    url: '/us/state/solar-panel-installers-in-arizona',
    status: 301,
    location: '/us/solar/arizona'
  },
  {
    shape: 'middleware /us/solar-panel-installer-directory',
    url: '/us/solar-panel-installer-directory',
    status: 301,
    location: '/us/solar'
  },
  {
    shape: 'middleware /us/solar-panel-installer/{slug}',
    url: '/us/solar-panel-installer/el-dorado-solar-dudes-el-dorado-hills',
    status: 301,
    location: '/us/installer/el-dorado-solar-dudes-el-dorado-hills'
  },
  { shape: 'middleware /{cc}/blogs/*', url: '/in/blogs/anything', status: 301, location: '/' },
  {
    shape: 'middleware /us/partners',
    url: '/us/partners',
    status: 301,
    location: '/us/business-listing'
  },
  { shape: 'middleware /us/get-quotes', url: '/us/get-quotes', status: 301, location: '/' },
  {
    shape: 'middleware /solar-pumps/kusum-scheme',
    url: '/solar-pumps/kusum-scheme',
    status: 301,
    location: '/solar-pumps/kusum-yojana'
  },
  {
    shape: 'middleware MOVED_TO_ROOT',
    url: '/in/unsubscribe',
    status: 301,
    location: '/unsubscribe'
  },
  // The one redirect whose query string is load-bearing: already-mailed opt-out
  // links carry ?unsubscribe=, and this rule runs before routing so it keeps it.
  // Dropping it would strand every link in mail already sent.
  {
    shape: 'middleware MOVED_TO_ROOT keeps ?query',
    url: '/in/unsubscribe?unsubscribe=smoke%40example.com',
    status: 301,
    location: '/unsubscribe?unsubscribe=smoke%40example.com'
  },
  {
    shape: 'middleware unknown country',
    url: '/zz/solar',
    status: 404,
    note: 'the country matcher'
  }
];

const CACHED = /^(HIT|STALE|PRERENDER|REVALIDATED)$/i;
const CACHE_RETRIES = 4;
const NETWORK_RETRIES = 3;

function cacheHeader(response) {
  return response.headers.get('x-vercel-cache') ?? response.headers.get('x-nextjs-cache');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A transport-level retry, and only that: a connection reset is retried, an
 * unexpected status is not. Measured against production, roughly one request
 * in a few hundred fails outright under this concurrency, which was enough to
 * make an otherwise clean run report two or three false failures. A harness
 * that cries wolf gets ignored, so a network error has to be told apart from
 * the thing being tested.
 */
async function request(url, options) {
  let lastError;
  for (let attempt = 0; attempt < NETWORK_RETRIES; attempt += 1) {
    if (attempt > 0) await sleep(300 * 2 ** (attempt - 1));
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

/**
 * Re-request until the cache reports the page, or we run out of patience.
 * Returns the last cache-header value seen, or null if the header is absent —
 * which is a different and worse failure, so the caller separates them.
 */
async function warmCacheState(url) {
  let state = null;
  for (let attempt = 0; attempt < CACHE_RETRIES; attempt += 1) {
    if (attempt > 0) await sleep(500 * 2 ** (attempt - 1));
    const response = await request(url, { method: 'HEAD', redirect: 'manual' });
    state = cacheHeader(response);
    if (state && CACHED.test(state)) return state;
  }
  return state;
}

async function check(entry) {
  const expected = entry.status ?? 200;
  const failures = [];
  let response;

  try {
    response = await request(BASE_URL + entry.url, { redirect: 'manual' });
  } catch (error) {
    return { entry, failures: [`request failed: ${error.message}`] };
  }

  if (response.status !== expected) {
    failures.push(`expected ${expected}, got ${response.status}`);
  }

  if (entry.location) {
    const actual = (response.headers.get('location') ?? '').replace(BASE_URL, '');
    if (actual !== entry.location) {
      failures.push(`expected redirect to ${entry.location}, got ${actual || '(none)'}`);
    }
  }

  // The second request. A cold ISR page answers MISS like a dynamic one, so
  // only this one discriminates. Bodies are never read; HEAD is enough and
  // keeps the harness cheap against ~1,400 pages' worth of routes.
  if (entry.isr && response.status === expected) {
    let state;
    try {
      state = await warmCacheState(BASE_URL + entry.url);
    } catch (error) {
      failures.push(`ISR re-request failed: ${error.message}`);
      return { entry, failures };
    }
    if (!state) {
      failures.push('no x-vercel-cache or x-nextjs-cache header — not served by a cache at all');
    } else if (!CACHED.test(state)) {
      failures.push(
        `still ${state} after ${CACHE_RETRIES} requests — check revalidate and generateStaticParams`
      );
    }
  }

  return { entry, failures, status: response.status };
}

async function run() {
  const results = [];
  const queue = [...SHAPES];

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let next = queue.shift(); next; next = queue.shift()) {
        const result = await check(next);
        results.push(result);
        if (VERBOSE || result.failures.length) {
          const mark = result.failures.length ? 'FAIL' : ' ok ';
          console.log(`${mark}  ${result.entry.shape}`);
          for (const failure of result.failures) console.log(`      ${failure}`);
        }
      }
    })
  );

  const failed = results.filter((result) => result.failures.length);
  const isrCount = SHAPES.filter((shape) => shape.isr).length;

  console.log(
    `\n${BASE_URL}\n${SHAPES.length} shapes, ${isrCount} of them cache-checked — ` +
      `${results.length - failed.length} passed, ${failed.length} failed`
  );

  if (failed.length) {
    console.log('\nFailed:');
    for (const result of failed) {
      console.log(`  ${result.entry.shape}  (${result.entry.url})`);
      for (const failure of result.failures) console.log(`      ${failure}`);
    }
    process.exitCode = 1;
  }
}

run();
