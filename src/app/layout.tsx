import type { Metadata } from "next"
import { Outfit, Playfair_Display } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClientProviders } from "@/components/providers/client-providers"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Grams Gym | Each Gram Matters",
    template: "%s | Grams Gym"
  },
  description: "Transform your body. Transform your life. Premium fitness training in Amman, Jordan.",
  keywords: ["gym", "fitness", "personal training", "Amman", "Jordan", "workout", "premium gym"],
  authors: [{ name: "Grams Gym" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gramsgym.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gramsgym.com",
    siteName: "Grams Gym",
    title: "Grams Gym | Each Gram Matters",
    description: "Transform your body. Transform your life. Premium fitness training in Amman, Jordan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grams Gym | Each Gram Matters",
    description: "Transform your body. Transform your life.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${playfair.variable} font-sans antialiased bg-black text-white`}>
        {children}
        <Toaster />
        <ClientProviders />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
