import { Metadata } from 'next'
import { Header } from '@/components/layout/header'

// Revalidate static content every 24 hours
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Grams Gym - a family-owned fitness center in Amman, Jordan since 2014. Discover our story, values, and commitment to your fitness journey.',
  openGraph: {
    title: 'About Grams Gym | Family-Owned Fitness Center in Amman',
    description: 'Learn about Grams Gym - a family-owned fitness center in Amman, Jordan since 2014.',
  },
}
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Dumbbell,
  Target,
  Users,
  Heart,
  Award,
  ChevronRight,
  Quote,
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Dumbbell className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Est. 2014</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="text-primary">Grams Gym</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Where every gram of effort counts towards your transformation.
              </p>
              <p className="text-lg text-muted-foreground" dir="rtl">
                حيث كل جرام من الجهد يساهم في تحولك
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2014 in the heart of Amman, Jordan, Grams Gym started with a simple mission:
                    to create a fitness community where every member feels supported in their journey.
                  </p>
                  <p>
                    What began as a small family-owned gym has grown into one of Amman&apos;s most trusted
                    fitness destinations, serving hundreds of members who share our passion for health and wellness.
                  </p>
                  <p>
                    Our name &quot;Grams&quot; reflects our philosophy: every gram matters. Whether you&apos;re tracking
                    your nutrition, measuring your progress, or pushing through that last rep, we believe
                    the small details add up to big transformations.
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-2xl aspect-square flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl font-bold text-primary mb-2">10+</div>
                  <p className="text-xl text-muted-foreground">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at Grams Gym
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Results-Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    We focus on measurable progress and real transformations
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    A supportive environment where members become family
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Dedication</h3>
                  <p className="text-sm text-muted-foreground">
                    Committed to your success with personalized attention
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Excellence</h3>
                  <p className="text-sm text-muted-foreground">
                    Top-quality equipment and expert coaching standards
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />
              <blockquote className="text-2xl md:text-3xl font-medium mb-6">
                &quot;Grams Gym changed my life. The coaches truly care about every member,
                and the community keeps me motivated every single day.&quot;
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Ahmad M.</p>
                  <p className="text-sm text-muted-foreground">Member since 2019</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Family Business Section */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-muted flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6">A Family Business</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Grams Gym is proudly family-owned and operated. Our four coaches aren&apos;t just
                    colleagues - they&apos;re family members who share a passion for fitness and a
                    commitment to helping others achieve their goals.
                  </p>
                  <p>
                    This family atmosphere extends to our members. When you join Grams Gym,
                    you&apos;re not just getting a membership - you&apos;re becoming part of our extended family.
                  </p>
                  <p>
                    We know every member by name, celebrate every milestone, and provide
                    the personalized attention that only a family business can offer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join the Family?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Start your fitness journey with us today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
