import { Inter } from 'next/font/google';
import './globals.css';

// Sans carries the directory surface — 90% of URLs — and every UI affordance.
// Variable font, so weight 400-700 costs one file.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: 'SolarVipani',
  description: 'Scaffold'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
