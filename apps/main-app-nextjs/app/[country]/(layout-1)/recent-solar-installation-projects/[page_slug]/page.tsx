export default async function Page({ params }: { params: Promise<{ country: string; page_slug: string }> }) {
  const { country, page_slug } = await params;
  return (
    <main>
      <h1>/[country]/recent-solar-installation-projects/[page_slug]</h1>
      <pre>{JSON.stringify({ country, page_slug }, null, 2)}</pre>
    </main>
  );
}
