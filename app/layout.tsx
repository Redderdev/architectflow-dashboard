import type { Metadata } from 'next'
import './globals.css'
import AutoRefresh from '@/components/AutoRefresh'

export const metadata: Metadata = {
  title: 'ArchitectFlow - AI Project Architecture Dashboard',
  description: 'Track features, implementation, and project state in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AutoRefresh />
        {children}
      </body>
    </html>
  )
}
