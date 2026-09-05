export async function GET(
  _request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  const resolved = await params;
  return Response.json(
    { todo: '/[country]/api/getLevel2s', params: resolved },
    { status: 501 }
  );
}
