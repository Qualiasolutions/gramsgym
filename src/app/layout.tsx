import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClientProviders } from "@/components/providers/client-providers"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Grams Gym | Each Gram Matters",
    template: "%s | Grams Gym"
  },
  description: "Transform your body. Transform your life. Professional fitness training in Amman, Jordan.",
  keywords: ["gym", "fitness", "personal training", "Amman", "Jordan", "workout", "جيم", "لياقة"],
  authors: [{ name: "Grams Gym" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gramsgym.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_JO",
    url: "https://gramsgym.com",
    siteName: "Grams Gym",
    title: "Grams Gym | Each Gram Matters",
    description: "Transform your body. Transform your life. Professional fitness training in Amman, Jordan.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className="dark">
      <body
        className={`${inter.variable} ${cairo.variable} font-sans antialiased bg-background text-foreground`}
        style={{
          fontFamily: locale === 'ar'
            ? 'var(--font-cairo), sans-serif'
            : 'var(--font-inter), sans-serif'
        }}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster />
          <ClientProviders />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
