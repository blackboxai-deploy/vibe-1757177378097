import './globals.css'
import { AppProvider } from '@/lib/store'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: 'Chat App - Connect & Communicate',
  description: 'A modern chat application with AI integration and real-time messaging',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <div className="flex h-screen bg-background text-foreground">
              {children}
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}