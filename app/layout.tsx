import type { Metadata } from 'next';
import { MidnightWalletProvider } from '@/lib/midnight/providers/MidnightWalletProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Midnight Starter',
  description: 'Starter template for Midnight Network apps',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MidnightWalletProvider>{children}</MidnightWalletProvider>
      </body>
    </html>
  );
}
