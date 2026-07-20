// Shared formatters for the chat tool-result widgets. The reference implementation
// hardcoded "₹" + toLocaleString at every call site; centralising it here keeps the
// widgets consistent and makes a future locale switch a one-file change.

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("en-IN");

/** Whole-rupee currency, e.g. ₹2,40,000. Returns "—" for missing values. */
export function formatCurrency(value: unknown): string {
  const n = Number(value);
  if (value === null || value === undefined || !Number.isFinite(n)) return "—";
  return inr.format(n);
}

/** Plain grouped number, e.g. 2,40,000. Returns "—" for missing values. */
export function formatNumber(value: unknown): string {
  const n = Number(value);
  if (value === null || value === undefined || !Number.isFinite(n)) return "—";
  return decimal.format(n);
}

/** Compact lakh form for large savings figures, e.g. ₹4.2L. */
export function formatLakh(value: unknown, fractionDigits = 1): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `₹${(n / 100000).toFixed(fractionDigits)}L`;
}

/** Compact thousand form, e.g. ₹48k. */
export function formatThousand(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `₹${(n / 1000).toFixed(0)}k`;
}

/** snake_case tool name → Title Case label. */
export function humanizeToolName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Short local time for message timestamps. */
export function formatTime(ts: unknown): string {
  const n = Number(ts);
  if (!Number.isFinite(n)) return "";
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(n));
}
