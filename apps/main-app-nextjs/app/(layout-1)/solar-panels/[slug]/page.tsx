export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <h1>/solar-panels/[slug]</h1>
      <pre>{JSON.stringify({ slug }, null, 2)}</pre>
    </main>
  );
}
