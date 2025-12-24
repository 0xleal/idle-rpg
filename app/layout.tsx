'use client';

import { Cinzel, Inter } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/components/GameProvider';
import { Sidebar } from '@/components/layout/Sidebar';

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Idle RPG</title>
        <meta name="description" content="A browser-based idle RPG inspired by Melvor Idle" />
      </head>
      <body className={`${cinzel.variable} ${inter.variable} antialiased`}>
        <GameProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
              {children}
            </main>
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
