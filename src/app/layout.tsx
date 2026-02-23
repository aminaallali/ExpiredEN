import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
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
    <html lang="en" className={`${plusJakarta.variable}`}>
      <body className="font-sans bg-brand-bg text-brand-text">
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
