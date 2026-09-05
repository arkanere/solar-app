export default async function Page({ params }: { params: Promise<{ country: string; district_slug: string }> }) {
  const { country, district_slug } = await params;
  return (
    <main>
      <h1>/[country]/partners/join/[district_slug]</h1>
      <pre>{JSON.stringify({ country, district_slug }, null, 2)}</pre>
    </main>
  );
}
