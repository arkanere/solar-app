export default async function Page({ params }: { params: Promise<{ country: string; state: string }> }) {
  const { country, state } = await params;
  return (
    <main>
      <h1>/[country]/solar/[state]</h1>
      <pre>{JSON.stringify({ country, state }, null, 2)}</pre>
    </main>
  );
}
