export async function GET(
  _request: Request,
  { params }: { params: Promise<{ country: string; county_slug: string }> }
) {
  const resolved = await params;
  return Response.json(
    { todo: '/[country]/county/[county_slug]', params: resolved },
    { status: 501 }
  );
}
