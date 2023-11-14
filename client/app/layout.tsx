import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

import {Roboto} from "@next/font/google";

const roboto=Roboto({
  subsets:['latin'],
  weight:["400","700"]
});

export const metadata: Metadata = {
  title: 'No Code',
  description: 'this is the platform who want to make backend or frontend without code',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
