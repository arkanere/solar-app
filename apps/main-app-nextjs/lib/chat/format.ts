/** Short local time for message timestamps, e.g. 3:05 pm. */
export function formatTime(ts: number): string {
  if (!Number.isFinite(ts)) return '';
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(
    new Date(ts)
  );
}
