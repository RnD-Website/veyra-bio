import { Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter_Tight({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter', display: 'swap' });

export const metadata = {
  title: 'Veyra Bio — Molecular Clarity',
  description: 'Veyra Bio helps research teams see, read and compare molecular chains, and understand the results in plain language.',
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
