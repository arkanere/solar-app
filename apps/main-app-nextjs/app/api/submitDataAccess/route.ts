export async function GET() {
  return Response.json({ todo: '/api/submitDataAccess' }, { status: 501 });
}
