import { Source_Serif_4 } from 'next/font/google';

// The serif is loaded here rather than in the root layout on purpose: it is for
// long-form reading, and the directory surface (90% of URLs) never uses it.
// Scoping it to this route group keeps it off those pages entirely.
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif'
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-editorial className={sourceSerif.variable}>
      {children}
    </div>
  );
}
