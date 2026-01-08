'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Reveal, BlurFade, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import {
  Dumbbell,
  Target,
  Users,
  Trophy,
  ArrowRight,
  Clock,
  CheckCircle2,
  Star,
} from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Bespoke Training',
    description: 'Meticulously crafted programs tailored to your unique physiology and aspirations.',
  },
  {
    icon: Users,
    title: 'Elite Coaches',
    description: 'World-class professionals dedicated to elevating your potential.',
  },
  {
    icon: Trophy,
    title: 'Proven Excellence',
    description: 'A decade of transforming lives with measurable, lasting results.',
  },
  {
    icon: Clock,
    title: 'Your Schedule',
    description: 'Premium access with flexible hours designed for your lifestyle.',
  },
]

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <div className="min-h-screen bg-noir-950">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-background-home.png"
            alt="Grams Gym"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-noir-950/95 via-noir-950/70 to-noir-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-noir-950/60" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="container relative z-10 pt-32 pb-20"
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-subtle mb-10"
            >
              <Star className="w-4 h-4 text-champagne-400 fill-champagne-400" />
              <span className="text-sm font-medium tracking-wide text-champagne-300/90">Premium Fitness Experience</span>
            </motion.div>

            {/* Main heading - Editorial style */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <span className="block text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight text-foreground/95">
                Each Gram
              </span>
              <span className="block text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight mt-2">
                <span className="text-gradient italic">Matters</span>
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-noir-200 max-w-2xl mx-auto mb-14 leading-relaxed"
            >
              Transform your body. Elevate your life.
              <span className="text-champagne-400/80"> Premium personal training in Amman, Jordan.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(201, 169, 108, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium text-base px-10 py-4"
                >
                  <span className="flex items-center gap-2.5">
                    Begin Your Journey
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.button>
              </Link>
              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-ghost text-base px-10 py-4"
                >
                  View Membership
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-9 rounded-full border border-noir-600 flex items-start justify-center p-1.5"
            >
              <motion.div className="w-1 h-2 rounded-full bg-champagne-500/80" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-36 relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-champagne-500/5 rounded-full blur-[150px] -translate-y-1/2" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <Reveal>
              <span className="text-xs text-champagne-500 uppercase tracking-[0.25em] font-medium mb-6 block">
                The Difference
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-8">
                Why <span className="text-gradient italic">Grams Gym</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-noir-300 leading-relaxed">
                We don&apos;t just build bodies. We craft transformations through
                precision, dedication, and an unwavering commitment to excellence.
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative p-8 rounded-2xl card-glass h-full spotlight"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-champagne-500/15 to-champagne-600/5 border border-champagne-500/10 flex items-center justify-center mb-7 group-hover:border-champagne-500/30 transition-colors duration-500">
                    <feature.icon className="w-6 h-6 text-champagne-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground/95">{feature.title}</h3>
                  <p className="text-noir-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-36 bg-noir-900/50 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-champagne-500/5 to-transparent" />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Visual element */}
            <Reveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl bg-noir-800/50 overflow-hidden border border-noir-700/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-champagne-500/10 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Dumbbell className="w-28 h-28 text-champagne-500/15 mx-auto mb-4" />
                      <p className="text-noir-500 text-sm tracking-wide">Premium Facilities</p>
                    </div>
                  </div>
                </div>
                {/* Floating accent card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -right-8 bottom-16 glass p-7 rounded-xl glow-champagne"
                >
                  <div className="text-4xl font-display font-medium text-gradient mb-2">
                    10+
                  </div>
                  <div className="text-sm text-noir-300">Years of Excellence</div>
                </motion.div>
              </div>
            </Reveal>

            {/* Content */}
            <div>
              <Reveal>
                <span className="text-xs text-champagne-500 uppercase tracking-[0.25em] font-medium mb-6 block">
                  Our Legacy
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-display font-medium mb-8 leading-[1.1]">
                  A Family Dedicated to{' '}
                  <span className="text-gradient italic">Your Success</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-noir-200 mb-6 leading-relaxed">
                  Founded in 2014, Grams Gym is a family-owned fitness sanctuary built on the
                  belief that every gram of effort counts. Our four elite coaches bring
                  decades of combined expertise to guide your transformation.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-noir-400 mb-10 leading-relaxed">
                  We&apos;re more than trainers—we&apos;re your partners in evolution.
                  When you join Grams Gym, you become part of our family.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link href="/about">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-ghost"
                    >
                      Discover Our Story
                    </motion.button>
                  </Link>
                  <Link href="/coaches">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-link"
                    >
                      Meet Our Coaches
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-36 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-champagne-500/5 rounded-full blur-[150px]" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <Reveal>
              <span className="text-xs text-champagne-500 uppercase tracking-[0.25em] font-medium mb-6 block">
                Investment
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-8">
                Transparent <span className="text-gradient italic">Pricing</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-noir-300">
                No hidden fees. No long-term contracts. Just excellence.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Monthly', price: 35, duration: '1 Month', popular: false },
              { name: 'Quarterly', price: 90, duration: '3 Months', popular: true },
              { name: 'Yearly', price: 300, duration: '12 Months', popular: false },
            ].map((plan, i) => (
              <BlurFade key={plan.name} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className={`relative p-8 rounded-2xl h-full ${
                    plan.popular
                      ? 'animated-border glow-champagne'
                      : 'card-glass'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-5 py-2 bg-gradient-to-r from-champagne-500 to-champagne-600 text-noir-950 text-xs font-semibold tracking-wide rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 text-foreground/90">{plan.name}</h3>
                    <p className="text-xs text-noir-400 uppercase tracking-wider mb-8">{plan.duration}</p>
                    <div className="mb-10">
                      <span className="text-5xl font-display font-medium">{plan.price}</span>
                      <span className="text-noir-400 ml-2 text-sm">JOD</span>
                    </div>
                    <ul className="space-y-4 text-sm text-noir-300 mb-10 text-left">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-champagne-500 shrink-0" />
                        Full facility access
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-champagne-500 shrink-0" />
                        Premium equipment
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-champagne-500 shrink-0" />
                        Locker amenities
                      </li>
                    </ul>
                    <Link href="/contact" className="block">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3.5 rounded-lg font-medium transition-all ${
                          plan.popular
                            ? 'btn-premium'
                            : 'btn-ghost'
                        }`}
                      >
                        {plan.popular ? <span>Get Started</span> : 'Get Started'}
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </BlurFade>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="text-center mt-14">
              <Link href="/pricing" className="btn-link">
                View All Options
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-36 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-noir-900/50 via-noir-950 to-noir-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-champagne-500/8 rounded-full blur-[180px]" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium mb-8 leading-[1.1]">
                Your Transformation
                <br />
                <span className="text-gradient italic">Begins Today</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xl text-noir-300 mb-12 leading-relaxed">
                Join Grams Gym and experience the difference that personalized attention
                and elite coaching can make.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 25px 70px rgba(201, 169, 108, 0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium text-lg px-14 py-5"
                >
                  <span className="flex items-center gap-3">
                    Begin Your Journey
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
