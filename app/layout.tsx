import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Web3Provider } from '@/components/providers/Web3Provider'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title:       'Zynex P2P — Exchange descentralizado Colombia',
  description: 'Compra y vende USDT con COP vía Nequi. Sin custodia centralizada.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-[#0a0a0a] text-white antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  )
}
