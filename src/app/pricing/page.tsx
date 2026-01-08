'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Reveal, BlurFade, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Dumbbell,
  Users,
  Clock,
  Zap,
} from 'lucide-react'

const membershipPlans = [
  {
    name: 'Monthly',
    price: 35,
    duration: '1 Month',
    description: 'Perfect for trying us out',
    features: [
      'Full gym access',
      'All equipment & facilities',
      'Locker room access',
      'Free WiFi',
    ],
    popular: false,
  },
  {
    name: 'Quarterly',
    price: 90,
    duration: '3 Months',
    description: 'Our most popular plan',
    features: [
      'Full gym access',
      'All equipment & facilities',
      'Locker room access',
      'Free WiFi',
      '1 Free PT session',
      'Nutrition consultation',
    ],
    popular: true,
    savings: 'Save 15 JOD',
  },
  {
    name: 'Yearly',
    price: 300,
    duration: '12 Months',
    description: 'Best value for committed members',
    features: [
      'Full gym access',
      'All equipment & facilities',
      'Locker room access',
      'Free WiFi',
      '4 Free PT sessions',
      'Nutrition consultation',
      'Body composition analysis',
      'Guest passes (2/month)',
    ],
    popular: false,
    savings: 'Save 120 JOD',
  },
]

const ptPackages = [
  {
    sessions: 4,
    price: 60,
    perSession: 15,
    name: 'Starter',
    description: 'Great for beginners',
  },
  {
    sessions: 8,
    price: 100,
    perSession: 12.5,
    name: 'Progress',
    description: 'Build momentum',
    popular: true,
  },
  {
    sessions: 16,
    price: 180,
    perSession: 11.25,
    name: 'Transform',
    description: 'Maximum results',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/about-and-contactus-backgrounds.jpg"
            alt="Pricing - Grams Gym"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-zinc-950" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-zinc-300">Simple & Transparent</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-semibold tracking-tight mb-8"
            >
              Investment in <span className="text-gradient">Yourself</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              No hidden fees. No long-term contracts. Just results.
              Choose the plan that fits your goals.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Reveal>
              <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                Memberships
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                Gym <span className="text-gradient">Memberships</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-400">
                Full access to our premium facilities and equipment
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {membershipPlans.map((plan, i) => (
              <BlurFade key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative p-8 rounded-2xl h-full flex flex-col ${
                    plan.popular
                      ? 'animated-border glow-gold'
                      : 'glass-light'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-black text-xs font-semibold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold mb-1">{plan.name}</h3>
                    <p className="text-sm text-zinc-500">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-display font-semibold">{plan.price}</span>
                      <span className="text-zinc-500">JOD</span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">{plan.duration}</p>
                    {plan.savings && (
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                        {plan.savings}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="block mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        plan.popular
                          ? 'btn-premium'
                          : 'btn-ghost'
                      }`}
                    >
                      {plan.popular ? <span>Get Started</span> : 'Get Started'}
                    </motion.button>
                  </Link>
                </motion.div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* PT Packages */}
      <section className="py-24 bg-zinc-950">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Reveal>
              <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                Personal Training
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                PT <span className="text-gradient">Packages</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-400">
                One-on-one training with our expert coaches
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {ptPackages.map((pkg, i) => (
              <BlurFade key={pkg.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative p-8 rounded-2xl text-center ${
                    pkg.popular
                      ? 'animated-border glow-gold'
                      : 'glass-light'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-black text-xs font-semibold rounded-full">
                        Best Value
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-1">{pkg.name}</h3>
                  <p className="text-sm text-zinc-500 mb-6">{pkg.description}</p>

                  <div className="mb-6">
                    <div className="text-5xl font-display font-semibold text-gradient mb-1">
                      {pkg.sessions}
                    </div>
                    <p className="text-zinc-500 text-sm">sessions</p>
                  </div>

                  <div className="mb-8">
                    <span className="text-3xl font-semibold">{pkg.price}</span>
                    <span className="text-zinc-500 ml-1">JOD</span>
                    <p className="text-xs text-gold-400 mt-1">{pkg.perSession} JOD/session</p>
                  </div>

                  <Link href="/contact" className="block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-lg font-medium ${
                        pkg.popular
                          ? 'btn-premium'
                          : 'btn-ghost'
                      }`}
                    >
                      {pkg.popular ? <span>Choose Plan</span> : 'Choose Plan'}
                    </motion.button>
                  </Link>
                </motion.div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Reveal>
              <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                Facilities
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                What&apos;s <span className="text-gradient">Included</span>
              </h2>
            </Reveal>
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Dumbbell, title: 'Premium Equipment', desc: 'Top-of-the-line machines and free weights' },
              { icon: Users, title: 'Expert Coaches', desc: 'Professional guidance available' },
              { icon: Clock, title: 'Extended Hours', desc: 'Open early to late, 7 days a week' },
              { icon: Zap, title: 'Clean Facilities', desc: 'Sanitized equipment and locker rooms' },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group p-8 rounded-2xl glass-light text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-gold-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px]" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-display font-semibold mb-6">
                Ready to <span className="text-gradient">Begin?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xl text-zinc-400 mb-10">
                Contact us to sign up or ask any questions
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(212, 164, 74, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium text-lg px-10 py-4"
                >
                  <span className="flex items-center gap-2">
                    Contact Us
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
