export async function GET() {
  return Response.json({ todo: '/api/stories' }, { status: 501 });
}
