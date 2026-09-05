export async function GET() {
  return Response.json({ todo: '/content-sitemap.xml' }, { status: 501 });
}
