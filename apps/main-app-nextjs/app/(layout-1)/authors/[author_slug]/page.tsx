export default async function Page({ params }: { params: Promise<{ author_slug: string }> }) {
  const { author_slug } = await params;
  return (
    <main>
      <h1>/authors/[author_slug]</h1>
      <pre>{JSON.stringify({ author_slug }, null, 2)}</pre>
    </main>
  );
}
