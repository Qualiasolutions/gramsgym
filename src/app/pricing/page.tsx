import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

// Revalidate pricing data every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Affordable gym memberships and personal training packages at Grams Gym, Amman. Monthly, quarterly, and yearly plans available. No hidden fees.',
  openGraph: {
    title: 'Pricing | Grams Gym Memberships & PT Packages',
    description: 'Affordable gym memberships and personal training packages at Grams Gym, Amman.',
  },
}
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  CreditCard,
  Dumbbell,
  Check,
  ChevronRight,
  Star,
} from 'lucide-react'

export default async function PricingPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  // Get active pricing
  const { data: pricing } = await client
    .from('pricing')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  const gymMemberships = pricing?.filter((p: { type: string }) => p.type === 'gym_membership') || []
  const ptPackages = pricing?.filter((p: { type: string }) => p.type === 'pt_package') || []

  // Default pricing if none configured
  const defaultGymMemberships = [
    { name_en: 'Monthly', name_ar: 'شهري', duration_or_sessions: '1 month', price: 35 },
    { name_en: 'Quarterly', name_ar: 'ربع سنوي', duration_or_sessions: '3 months', price: 90 },
    { name_en: 'Yearly', name_ar: 'سنوي', duration_or_sessions: '12 months', price: 300, popular: true },
  ]

  const defaultPTPackages = [
    { name_en: '5 Sessions', name_ar: '5 جلسات', duration_or_sessions: '5 sessions', price: 75 },
    { name_en: '10 Sessions', name_ar: '10 جلسات', duration_or_sessions: '10 sessions', price: 140, popular: true },
    { name_en: '20 Sessions', name_ar: '20 جلسة', duration_or_sessions: '20 sessions', price: 250 },
  ]

  const displayGymMemberships = gymMemberships.length > 0 ? gymMemberships : defaultGymMemberships
  const displayPTPackages = ptPackages.length > 0 ? ptPackages : defaultPTPackages

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Flexible Plans</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your fitness goals. No hidden fees, no long-term commitments required.
            </p>
          </div>
        </section>

        {/* Gym Memberships */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">Gym Memberships</h2>
              </div>
              <p className="text-muted-foreground">Full access to all gym equipment and facilities</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {displayGymMemberships.map((plan: {
                id?: string
                name_en: string
                name_ar: string
                duration_or_sessions: string
                price: number
                popular?: boolean
              }, index: number) => (
                <Card
                  key={plan.id || index}
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name_en}</CardTitle>
                    <CardDescription>{plan.name_ar}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">JOD</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      {plan.duration_or_sessions}
                    </p>
                    <ul className="space-y-3 text-sm mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Full gym access
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        All equipment
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Locker room access
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Free parking
                      </li>
                    </ul>
                    <Link href="/contact">
                      <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PT Packages */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Dumbbell className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">Personal Training</h2>
              </div>
              <p className="text-muted-foreground">One-on-one sessions with expert coaches</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {displayPTPackages.map((plan: {
                id?: string
                name_en: string
                name_ar: string
                duration_or_sessions: string
                price: number
                popular?: boolean
              }, index: number) => (
                <Card
                  key={plan.id || index}
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">
                        <Star className="h-3 w-3 mr-1" />
                        Best Value
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name_en}</CardTitle>
                    <CardDescription>{plan.name_ar}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">JOD</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      {plan.duration_or_sessions}
                    </p>
                    <ul className="space-y-3 text-sm mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Personal trainer
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Custom workout plan
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Progress tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Nutrition guidance
                      </li>
                    </ul>
                    <Link href="/contact">
                      <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Can I freeze my membership?</h3>
                <p className="text-muted-foreground">
                  Yes, you can freeze your membership for up to 2 weeks per month for medical reasons or travel.
                  Just let us know in advance.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Do PT sessions expire?</h3>
                <p className="text-muted-foreground">
                  PT sessions are valid for 3 months from the date of purchase. We recommend scheduling
                  regular sessions for best results.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Can I choose my personal trainer?</h3>
                <p className="text-muted-foreground">
                  Absolutely! You can select your preferred coach when purchasing a PT package.
                  We&apos;ll match you based on your goals and schedule.
                </p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Is there a registration fee?</h3>
                <p className="text-muted-foreground">
                  No hidden fees! The prices shown are exactly what you pay. We believe in transparent,
                  straightforward pricing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5 border-t border-border">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Visit us today or contact us for more information
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8">
                Contact Us
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
