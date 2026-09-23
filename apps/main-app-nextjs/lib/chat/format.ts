/** Short local time for message timestamps, e.g. 3:05 pm. */
export function formatTime(ts: number): string {
  if (!Number.isFinite(ts)) return '';
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(
    new Date(ts)
  );
}

// Formatters for the tool-result cards. Missing values render as "—".
const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});
const decimal = new Intl.NumberFormat('en-IN');

const toNumber = (value: unknown) =>
  value === null || value === undefined || value === '' ? NaN : Number(value);

/** Whole-rupee currency, e.g. ₹2,40,000. */
export function formatCurrency(value: unknown): string {
  const n = toNumber(value);
  return Number.isFinite(n) ? inr.format(n) : '—';
}

/** Grouped number, e.g. 2,40,000. */
export function formatNumber(value: unknown): string {
  const n = toNumber(value);
  return Number.isFinite(n) ? decimal.format(n) : '—';
}

/** Lakh form for large figures, e.g. ₹4.2L. */
export function formatLakh(value: unknown, fractionDigits = 1): string {
  const n = toNumber(value);
  return Number.isFinite(n) ? `₹${(n / 100000).toFixed(fractionDigits)}L` : '—';
}

/** Thousand form, e.g. ₹48k. */
export function formatThousand(value: unknown): string {
  const n = toNumber(value);
  return Number.isFinite(n) ? `₹${(n / 1000).toFixed(0)}k` : '—';
}

/** snake_case tool name → Title Case label. */
export function humanizeToolName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
