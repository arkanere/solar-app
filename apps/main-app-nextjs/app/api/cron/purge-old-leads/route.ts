export async function GET() {
  return Response.json({ todo: '/api/cron/purge-old-leads' }, { status: 501 });
}
