/**
 * Site chrome for the country tree. This layout exists only to give the
 * header and footer their CountryConfig — see components/chrome/Chrome.tsx
 * for why they are mounted here rather than in the root layout.
 *
 * `isCountry` is checked again even though middleware.ts already 404s an
 * unknown two-letter prefix: `getCountry` throws, and a layout that throws is
 * a 500 on every page under it. The pages that already had this guard kept
 * theirs — this one is about the layout's own safety, not theirs.
 */
import { notFound } from 'next/navigation';
import { Chrome } from '@/components/chrome';
import { getCountry, isCountry } from '@/lib/countries';

export default async function CountryLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  if (!isCountry(country)) notFound();

  return <Chrome country={getCountry(country)}>{children}</Chrome>;
}
