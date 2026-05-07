import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ColdHook — AI Cold Email Personalizer",
  description: "AI-powered cold email personalization for SDRs and sales professionals. Write emails that actually get replies.",
  keywords: ["cold email", "sales", "SDR", "AI", "email personalization", "outreach"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider signInForceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
      <html lang="en" className={`${inter.variable} h-full`}>
        <body className="min-h-full antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
