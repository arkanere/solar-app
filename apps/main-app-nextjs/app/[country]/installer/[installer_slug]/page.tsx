export default async function Page({ params }: { params: Promise<{ country: string; installer_slug: string }> }) {
  const { country, installer_slug } = await params;
  return (
    <main>
      <h1>/[country]/installer/[installer_slug]</h1>
      <pre>{JSON.stringify({ country, installer_slug }, null, 2)}</pre>
    </main>
  );
}
