export async function GET(
  _request: Request,
  { params }: { params: Promise<{ country: string; city: string }> }
) {
  const resolved = await params;
  return Response.json(
    { todo: '/[country]/solar-panel-installer-directory/[city]', params: resolved },
    { status: 501 }
  );
}
