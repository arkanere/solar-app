export default async function Page({ params }: { params: Promise<{ country: string; state: string; district: string }> }) {
  const { country, state, district } = await params;
  return (
    <main>
      <h1>/[country]/solar/[state]/[district]</h1>
      <pre>{JSON.stringify({ country, state, district }, null, 2)}</pre>
    </main>
  );
}
