export async function GET() {
  return Response.json({ todo: '/sitemap.xml' }, { status: 501 });
}
