import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkedUp - Smart Job Search',
  description: 'Find the perfect job match and generate personalized cover letters with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b bg-background">
          <div className="container mx-auto py-4 px-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="text-2xl font-bold">LinkedUp</span>
              </div>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-background">
          <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} LinkedUp. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-sm text-muted-foreground hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:underline">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}