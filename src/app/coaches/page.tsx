'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Reveal, BlurFade, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import {
  Award,
  Calendar,
  ArrowRight,
  Sparkles,
  User,
} from 'lucide-react'

const coaches = [
  {
    id: 1,
    name: 'Ahmad Grams',
    role: 'Head Coach & Founder',
    specialization: 'Strength Training & Bodybuilding',
    experience: '15+ years',
    bio: 'Founder of Grams Gym with a passion for helping clients build strength and confidence. Ahmad has trained hundreds of members and competed in multiple bodybuilding competitions.',
    certifications: ['NASM-CPT', 'ISSA Bodybuilding', 'Precision Nutrition L1'],
  },
  {
    id: 2,
    name: 'Mohammad Grams',
    role: 'Senior Coach',
    specialization: 'Weight Loss & Conditioning',
    experience: '12+ years',
    bio: 'Specializes in body transformations through personalized nutrition and high-intensity training. Mohammad has helped over 200 members achieve their weight loss goals.',
    certifications: ['ACE-CPT', 'CrossFit L2', 'PN Nutrition Coach'],
  },
  {
    id: 3,
    name: 'Khaled Grams',
    role: 'Performance Coach',
    specialization: 'Athletic Performance',
    experience: '10+ years',
    bio: 'Former national athlete focused on helping clients achieve peak physical performance. Khaled works with athletes from various sports to enhance their strength and conditioning.',
    certifications: ['CSCS', 'USA Weightlifting L1', 'FMS Certified'],
  },
  {
    id: 4,
    name: 'Omar Grams',
    role: 'Fitness Coach',
    specialization: 'Functional Fitness',
    experience: '8+ years',
    bio: 'Passionate about making fitness accessible and enjoyable for everyone. Omar specializes in helping beginners build confidence and establish healthy habits.',
    certifications: ['NASM-CPT', 'TRX Certified', 'Kettlebell Specialist'],
  },
]

export default function CoachesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/about-and-contactus-backgrounds.jpg"
            alt="Our Coaches - Grams Gym"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-zinc-950" />
          <div className="absolute top-1/3 right-1/4 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gold-500/5 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
        </div>

        <div className="container relative">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-light mb-4 sm:mb-6 md:mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400" />
              <span className="text-xs sm:text-sm text-zinc-300">Expert Guidance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight mb-4 sm:mb-6 md:mb-8"
            >
              Meet Your <span className="text-gradient">Coaches</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl"
            >
              Four family members united by a passion for fitness, dedicated to
              helping you achieve your goals.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16 border-y border-zinc-800/50 bg-zinc-950/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { value: '4', label: 'Expert Coaches' },
              { value: '45+', label: 'Years Combined' },
              { value: '15+', label: 'Certifications' },
              { value: '500+', label: 'Clients Helped' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-gradient mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-zinc-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {coaches.map((coach) => (
              <StaggerItem key={coach.id}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative rounded-xl sm:rounded-2xl glass-light overflow-hidden"
                >
                  {/* Image area */}
                  <div className="relative h-48 sm:h-56 md:h-64 bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center">
                        <User className="w-10 h-10 sm:w-12 sm:h-12 text-gold-400/50" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 md:p-8">
                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-1 truncate">{coach.name}</h3>
                        <p className="text-gold-400 text-xs sm:text-sm font-medium">{coach.role}</p>
                      </div>
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0">
                        {coach.experience}
                      </span>
                    </div>

                    <p className="text-zinc-400 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3">{coach.bio}</p>

                    <div className="mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm text-zinc-500 mb-1 sm:mb-2">Specialization</p>
                      <p className="text-white font-medium text-sm sm:text-base">{coach.specialization}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                      {coach.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gold-500/10 text-gold-400 text-[10px] sm:text-xs font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>

                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-ghost flex items-center justify-center gap-2 py-2.5 sm:py-3 min-h-[44px]"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Session
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why Train With Us */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-zinc-950">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div>
              <Reveal>
                <span className="text-xs sm:text-sm text-gold-400 uppercase tracking-wider font-medium mb-3 sm:mb-4 block">
                  The Difference
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold mb-4 sm:mb-5 md:mb-6">
                  Why Train With <span className="text-gradient">Us?</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-base sm:text-lg text-zinc-400 mb-5 sm:mb-6 md:mb-8">
                  Our coaches don&apos;t just count reps—they build relationships.
                  As a family-owned gym, we take personal pride in every member&apos;s
                  success.
                </p>
              </Reveal>

              <div className="space-y-3 sm:space-y-4">
                {[
                  'Personalized programs tailored to your goals',
                  'Nutrition guidance included with coaching',
                  'Flexible scheduling that fits your life',
                  'Ongoing support and accountability',
                ].map((item, i) => (
                  <BlurFade key={item} delay={0.3 + i * 0.1}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                        <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-400" />
                      </div>
                      <span className="text-zinc-300 text-sm sm:text-base">{item}</span>
                    </div>
                  </BlurFade>
                ))}
              </div>
            </div>

            <Reveal direction="right">
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="w-32 h-32 text-gold-500/10" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 opacity-20 blur-2xl" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-gold-500/10 rounded-full blur-[100px] sm:blur-[120px] md:blur-[150px]" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center px-2 sm:px-0">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-4 sm:mb-5 md:mb-6">
                Ready to Start <span className="text-gradient">Training?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-6 sm:mb-8 md:mb-10">
                Book your first session and experience the Grams Gym difference
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(212, 164, 74, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium text-sm sm:text-base md:text-lg px-8 sm:px-10 py-3 sm:py-3.5 md:py-4 min-h-[48px]"
                >
                  <span className="flex items-center gap-2">
                    Book a Session
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
