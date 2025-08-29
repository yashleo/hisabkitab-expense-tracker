import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HisabKitab - Personal Expense Tracker",
  description: "Track your daily expenses with ease. A modern, secure expense tracker built with Next.js and Firebase.",
  keywords: ["expense tracker", "budget", "finance", "money management", "personal finance"],
  authors: [{ name: "Yash Leo" }],
  creator: "Yash Leo",
  metadataBase: new URL("https://hisabkitab.vercel.app"),
  openGraph: {
    title: "HisabKitab - Personal Expense Tracker",
    description: "Track your daily expenses with ease. A modern, secure expense tracker built with Next.js and Firebase.",
    type: "website",
    locale: "en_US",
    siteName: "HisabKitab",
  },
  twitter: {
    card: "summary_large_image",
    title: "HisabKitab - Personal Expense Tracker",
    description: "Track your daily expenses with ease. A modern, secure expense tracker built with Next.js and Firebase.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
