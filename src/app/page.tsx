'use client'

import Link from 'next/link'
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
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Personalized Training',
    description: 'Custom workout programs designed specifically for your goals, body type, and lifestyle.',
  },
  {
    icon: Users,
    title: 'Expert Coaches',
    description: 'Train with certified professionals who are passionate about your success.',
  },
  {
    icon: Trophy,
    title: 'Proven Results',
    description: 'Join hundreds of members who have transformed their lives at Grams Gym.',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Train on your schedule with extended hours and online booking.',
  },
]

const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '500+', label: 'Members Transformed' },
  { value: '4', label: 'Expert Coaches' },
  { value: '98%', label: 'Client Satisfaction' },
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
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="container relative z-10 pt-32 pb-20"
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-zinc-300">Premium Fitness Experience</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold tracking-tight mb-8"
            >
              Each Gram
              <br />
              <span className="text-gradient">Matters</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12"
            >
              Transform your body. Transform your life. Premium personal training
              in Amman, Jordan.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(212, 164, 74, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium text-lg px-10 py-4"
                >
                  <span className="flex items-center gap-2">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </Link>
              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-ghost text-lg px-10 py-4"
                >
                  View Pricing
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2"
            >
              <motion.div className="w-1 h-2 rounded-full bg-gold-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 border-y border-zinc-800/50 bg-zinc-950/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-display font-semibold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <Reveal>
              <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                Why Choose Us
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                The Grams Gym <span className="text-gradient">Difference</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-400">
                We&apos;re not just a gym. We&apos;re a community dedicated to helping you
                become the best version of yourself.
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative p-8 rounded-2xl glass-light card-hover h-full"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-500/5 to-transparent" />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image/Visual */}
            <Reveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl bg-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Dumbbell className="w-24 h-24 text-gold-500/20 mx-auto mb-4" />
                      <p className="text-zinc-600 text-sm">Premium Facilities</p>
                    </div>
                  </div>
                </div>
                {/* Floating stats card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -right-6 bottom-12 glass p-6 rounded-xl"
                >
                  <div className="text-3xl font-display font-semibold text-gradient mb-1">
                    10+
                  </div>
                  <div className="text-sm text-zinc-400">Years of Excellence</div>
                </motion.div>
              </div>
            </Reveal>

            {/* Content */}
            <div>
              <Reveal>
                <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                  Our Story
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                  A Family Dedicated to <span className="text-gradient">Your Success</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-zinc-400 mb-6">
                  Founded in 2014, Grams Gym is a family-owned fitness center built on the
                  belief that every gram of effort counts. Our four expert coaches bring
                  decades of combined experience to help you achieve your goals.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-zinc-500 mb-8">
                  We&apos;re more than just trainers—we&apos;re your partners in transformation.
                  When you join Grams Gym, you become part of our family.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/about">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-ghost"
                    >
                      Learn More
                    </motion.button>
                  </Link>
                  <Link href="/coaches">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-gold-400 hover:text-gold-300 font-medium flex items-center gap-2 transition-colors"
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
      <section className="py-32 relative">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <Reveal>
              <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                Investment
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                Simple, Transparent <span className="text-gradient">Pricing</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-400">
                No hidden fees. No long-term contracts. Just results.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Monthly', price: 35, duration: '1 Month', popular: false },
              { name: 'Quarterly', price: 90, duration: '3 Months', popular: true },
              { name: 'Yearly', price: 300, duration: '12 Months', popular: false },
            ].map((plan, i) => (
              <BlurFade key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative p-8 rounded-2xl h-full ${
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
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-sm text-zinc-500 mb-6">{plan.duration}</p>
                    <div className="mb-8">
                      <span className="text-5xl font-display font-semibold">{plan.price}</span>
                      <span className="text-zinc-500 ml-2">JOD</span>
                    </div>
                    <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-400" />
                        Full gym access
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-400" />
                        All equipment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-400" />
                        Locker room
                      </li>
                    </ul>
                    <Link href="/contact" className="block">
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
                  </div>
                </motion.div>
              </BlurFade>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="text-center mt-12">
              <Link
                href="/pricing"
                className="text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-2 transition-colors"
              >
                View All Pricing Options
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px]" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-display font-semibold mb-6">
                Your Transformation
                <br />
                <span className="text-gradient">Starts Today</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xl text-zinc-400 mb-10">
                Join Grams Gym and experience the difference that personalized attention
                and expert coaching can make.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(212, 164, 74, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium text-lg px-12 py-5"
                >
                  <span className="flex items-center gap-2">
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
