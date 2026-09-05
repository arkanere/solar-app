export default async function Page({ params }: { params: Promise<{ country: string; state: string; district: string; slug: string }> }) {
  const { country, state, district, slug } = await params;
  return (
    <main>
      <h1>/[country]/solar/[state]/[district]/[slug]</h1>
      <pre>{JSON.stringify({ country, state, district, slug }, null, 2)}</pre>
    </main>
  );
}
