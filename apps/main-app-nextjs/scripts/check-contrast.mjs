/**
 * Contrast baseline for the token layer.
 *
 * Reads the oklch values straight out of app/globals.css and re-checks every
 * pairing the archetypes actually use. Run it after changing any colour token:
 *   npm run check:contrast -w main-app-nextjs
 *
 * The pairings are not decorative, and "against the background it actually sits
 * on" is the load-bearing half: ink-subtle is checked on a table stripe and each
 * status colour on its own tinted surface, not on canvas. Check those against the
 * lighter ground and they pass here while failing on the page.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CSS = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'globals.css');

/* --- oklch -> sRGB, then WCAG 2.1 relative luminance ---------------------- */
function oklchToSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ].map((v) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.max(v, 0) ** (1 / 2.4) - 0.055;
    return Math.min(255, Math.max(0, Math.round(c * 255)));
  });
}

function contrast(a, b) {
  const lum = ([r, g, bl]) => {
    const f = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* --- parse the token layer ------------------------------------------------ */
const css = readFileSync(CSS, 'utf8');
const tokens = {};
for (const [, name, L, C, h] of css.matchAll(
  /--color-([a-z-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g
)) {
  tokens[name] = oklchToSrgb(Number(L) / 100, Number(C), Number(h));
}

const need = (n) => {
  if (!tokens[n]) {
    console.error(`Token --color-${n} not found in globals.css`);
    process.exit(2);
  }
  return tokens[n];
};

/* --- the pairings the pages actually use ---------------------------------- */
const AA_TEXT = 4.5;
const AA_UI = 3.0;

const pairings = [
  ['ink on canvas', 'ink', 'canvas', AA_TEXT],
  ['ink on surface-sunken (table stripe)', 'ink', 'surface-sunken', AA_TEXT],
  ['ink-muted on surface-sunken', 'ink-muted', 'surface-sunken', AA_TEXT],
  ['ink-subtle on surface-sunken (worst case)', 'ink-subtle', 'surface-sunken', AA_TEXT],
  ['ink-subtle on canvas', 'ink-subtle', 'canvas', AA_TEXT],
  ['action on canvas (link)', 'action', 'canvas', AA_TEXT],
  ['action on surface-sunken (link in stripe)', 'action', 'surface-sunken', AA_TEXT],
  ['action on accent-surface', 'action', 'accent-surface', AA_TEXT],
  ['action-ink on action (button fill)', 'action-ink', 'action', AA_TEXT],
  ['action-ink on action-hover', 'action-ink', 'action-hover', AA_TEXT],
  ['ink on brand fill (badge text)', 'ink', 'brand', AA_TEXT],
  ['ink on brand-surface', 'ink', 'brand-surface', AA_TEXT],
  ['line-strong on canvas (input border)', 'line-strong', 'canvas', AA_UI],
  ['action as focus ring on canvas', 'action', 'canvas', AA_UI],
  ['success on success-surface', 'success', 'success-surface', AA_TEXT],
  ['danger on danger-surface', 'danger', 'danger-surface', AA_TEXT],
  ['danger on canvas (inline field error)', 'danger', 'canvas', AA_TEXT]
];

let failed = 0;
console.log('pairing                                          ratio   need');
for (const [label, fg, bg, min] of pairings) {
  const r = contrast(need(fg), need(bg));
  if (r < min) failed++;
  console.log(
    `${r >= min ? 'PASS' : 'FAIL'}  ${label.padEnd(44)} ${r.toFixed(2).padStart(5)}   ${min}`
  );
}

/* Informational, and deliberately not requirements — both are why a structural
   rule exists in the base layer instead of a colour token. */
console.log('\ninformational (base-layer rules exist because of these)');
console.log(
  `      action vs ink = ${contrast(need('action'), need('ink')).toFixed(2)}` +
    '  -> under 3:1, so body links must underline'
);
console.log(
  `      brand vs canvas = ${contrast(need('brand'), need('canvas')).toFixed(2)}` +
    '  -> under 3:1, so a brand chip needs a border'
);

if (failed) {
  console.error(`\n${failed} required pairing(s) failing.`);
  process.exit(1);
}
console.log(`\nAll ${pairings.length} required pairings pass.`);
