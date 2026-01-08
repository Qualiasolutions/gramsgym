import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { Outfit, Playfair_Display, Cairo } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClientProviders } from "@/components/providers/client-providers"
import { LoadingProvider } from "@/components/providers/loading-provider"
import { LanguageProvider } from "@/lib/i18n"
import "./globals.css"

// Font optimization with display: swap for better LCP
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

// Arabic font
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: true,
})

// Viewport configuration for better mobile experience
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030303',
}

export const metadata: Metadata = {
  title: {
    default: "Grams Gym | Each Gram Matters",
    template: "%s | Grams Gym"
  },
  description: "Elevate your potential. Premium personal training in Amman, Jordan. Where every gram of effort matters.",
  keywords: ["gym", "fitness", "personal training", "Amman", "Jordan", "workout", "premium gym", "luxury fitness"],
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} ${cairo.variable} font-sans antialiased bg-black text-white`}>
        <LanguageProvider>
          <Suspense fallback={null}>
            <LoadingProvider initialLoadDuration={3000} pageTransitionDuration={1000}>
              {children}
            </LoadingProvider>
          </Suspense>
          <Toaster />
          <ClientProviders />
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
