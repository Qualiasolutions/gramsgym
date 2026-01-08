import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gramsgym.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/coach/dashboard',
          '/coach/members',
          '/coach/bookings',
          '/coach/schedule',
          '/coach/subscriptions',
          '/coach/settings',
          '/member/dashboard',
          '/member/bookings',
          '/member/book',
          '/member/profile',
          '/member/subscriptions',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
