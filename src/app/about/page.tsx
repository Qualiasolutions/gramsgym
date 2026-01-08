'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Reveal, BlurFade, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import {
  Dumbbell,
  Target,
  Users,
  Heart,
  Award,
  ArrowRight,
  Quote,
  Sparkles,
} from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'We focus on measurable progress and real transformations',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'A supportive environment where members become family',
  },
  {
    icon: Heart,
    title: 'Dedication',
    description: 'Committed to your success with personalized attention',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Top-quality equipment and expert coaching standards',
  },
]

const timeline = [
  { year: '2014', title: 'Foundation', description: 'Grams Gym opens its doors in Amman' },
  { year: '2016', title: 'Growth', description: 'Expanded facilities and added new equipment' },
  { year: '2019', title: 'Recognition', description: 'Named top gym in local fitness awards' },
  { year: '2024', title: 'Innovation', description: 'Launched digital member experience' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container relative">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-zinc-300">Est. 2014</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-semibold tracking-tight mb-8"
            >
              Our <span className="text-gradient">Story</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-2xl"
            >
              Where every gram of effort counts towards your transformation.
              A decade of excellence in fitness.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 relative">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <Reveal direction="left">
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl font-display font-bold text-gold-500/10 mb-4">
                        10+
                      </div>
                      <p className="text-zinc-500">Years of Excellence</p>
                    </div>
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 opacity-20 blur-2xl" />
              </div>
            </Reveal>

            {/* Content */}
            <div className="space-y-6">
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-display font-semibold">
                  A Family Built on <span className="text-gradient">Passion</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-lg text-zinc-400">
                  Founded in 2014 in the heart of Amman, Jordan, Grams Gym started with a
                  simple mission: to create a fitness community where every member feels
                  supported in their journey.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-zinc-500">
                  What began as a small family-owned gym has grown into one of Amman&apos;s
                  most trusted fitness destinations, serving hundreds of members who share
                  our passion for health and wellness.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-zinc-500">
                  Our name &quot;Grams&quot; reflects our philosophy: every gram matters.
                  Whether you&apos;re tracking your nutrition, measuring your progress, or
                  pushing through that last rep, we believe the small details add up to
                  big transformations.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-800/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Reveal>
              <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                Our Journey
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-display font-semibold">
                A Decade of <span className="text-gradient">Growth</span>
              </h2>
            </Reveal>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 md:-translate-x-px" />

              {timeline.map((item, i) => (
                <BlurFade key={item.year} delay={i * 0.15}>
                  <div className={`relative flex items-center gap-8 mb-12 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-gold-500 -translate-x-1/2 ring-4 ring-black" />

                    {/* Content */}
                    <div className={`ml-20 md:ml-0 md:w-1/2 ${
                      i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'
                    }`}>
                      <span className="text-gold-400 font-display text-2xl font-semibold">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                      <p className="text-zinc-500">{item.description}</p>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Reveal>
              <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                What We Stand For
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                Our <span className="text-gradient">Values</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-zinc-400">
                The principles that guide everything we do at Grams Gym
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group p-8 rounded-2xl glass-light text-center h-full"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-zinc-400 text-sm">{value.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[100px]" />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <Quote className="w-16 h-16 text-gold-500/20 mx-auto mb-8" />
            </Reveal>
            <Reveal delay={0.1}>
              <blockquote className="text-3xl md:text-4xl font-display font-medium leading-relaxed mb-8">
                &quot;Grams Gym changed my life. The coaches truly care about every member,
                and the community keeps me motivated every single day.&quot;
              </blockquote>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                  <span className="text-black font-semibold">A</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Ahmad M.</p>
                  <p className="text-sm text-zinc-500">Member since 2019</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Family Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <span className="text-sm text-gold-400 uppercase tracking-wider font-medium mb-4 block">
                  Our Family
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                  More Than a <span className="text-gradient">Gym</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-zinc-400 mb-6">
                  Grams Gym is proudly family-owned and operated. Our four coaches
                  aren&apos;t just colleagues—they&apos;re family members who share a passion
                  for fitness and a commitment to helping others achieve their goals.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-zinc-500 mb-8">
                  This family atmosphere extends to our members. When you join Grams Gym,
                  you&apos;re not just getting a membership—you&apos;re becoming part of our
                  extended family. We know every member by name, celebrate every milestone,
                  and provide the personalized attention that only a family business can offer.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <Link href="/coaches">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-premium"
                  >
                    <span className="flex items-center gap-2">
                      Meet the Team
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </motion.button>
                </Link>
              </Reveal>
            </div>

            <Reveal direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-zinc-900 flex items-center justify-center"
                  >
                    <Users className="w-12 h-12 text-zinc-800" />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px]" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-display font-semibold mb-6">
                Ready to Join <span className="text-gradient">the Family?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xl text-zinc-400 mb-10">
                Start your fitness journey with us today
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(212, 164, 74, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-premium text-lg px-10 py-4"
                  >
                    <span>Get Started</span>
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
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
