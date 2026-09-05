export default async function Page({ params }: { params: Promise<{ slug: string; model_slug: string }> }) {
  const { slug, model_slug } = await params;
  return (
    <main>
      <h1>/solar-inverters/[slug]/[model_slug]</h1>
      <pre>{JSON.stringify({ slug, model_slug }, null, 2)}</pre>
    </main>
  );
}
