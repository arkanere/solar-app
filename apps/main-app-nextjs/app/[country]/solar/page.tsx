export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  return (
    <main>
      <h1>/[country]/solar</h1>
      <pre>{JSON.stringify({ country }, null, 2)}</pre>
    </main>
  );
}
