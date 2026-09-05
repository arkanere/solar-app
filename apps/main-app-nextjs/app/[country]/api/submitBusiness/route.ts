export async function GET(
  _request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  const resolved = await params;
  return Response.json(
    { todo: '/[country]/api/submitBusiness', params: resolved },
    { status: 501 }
  );
}
