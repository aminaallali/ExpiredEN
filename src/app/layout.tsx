import type { Metadata } from 'next'
import { Space_Mono, Syne } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Load fonts via next/font — no render-blocking CSS imports
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const syne = Syne({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ENS Expiring — Expiring .eth Domains',
  description:
    'Track ENS domains in grace period, premium auction, and newly available for registration.',
  metadataBase: new URL('https://underbottom.com'),
  openGraph: {
    title: 'ENS Expiring',
    description: 'Find expiring .eth domains before anyone else',
    siteName: 'ENS Expiring',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${syne.variable}`}
    >
      <body className="font-mono">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
