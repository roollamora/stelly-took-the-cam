import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STELLY TOOK THE CAM',
  description: 'Coming Soon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/Fonts/WhatsHappened.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}