export default async function Page({ params }: { params: Promise<{ country: string; project_id: string }> }) {
  const { country, project_id } = await params;
  return (
    <main>
      <h1>/[country]/project/[project_id]</h1>
      <pre>{JSON.stringify({ country, project_id }, null, 2)}</pre>
    </main>
  );
}
