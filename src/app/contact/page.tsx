'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Reveal } from '@/components/ui/motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Instagram,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success('Message sent! We\'ll get back to you soon.')
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950" />
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
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
              <span className="text-sm text-zinc-300">Get In Touch</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-semibold tracking-tight mb-8"
            >
              Let&apos;s <span className="text-gradient">Talk</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-zinc-400 max-w-2xl"
            >
              Ready to start your fitness journey? Have questions?
              We&apos;d love to hear from you.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Reveal>
              <div className="glass-light rounded-2xl p-8 md:p-10">
                <h2 className="text-2xl font-semibold mb-2">Send a Message</h2>
                <p className="text-zinc-400 mb-8">
                  Fill out the form and we&apos;ll get back to you within 24 hours.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-zinc-400 mb-6">
                      Thank you for reaching out. We&apos;ll be in touch soon.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-gold-400 hover:text-gold-300 font-medium"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder="+962 79 XXX XXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Interest
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                      >
                        <option value="membership">Gym Membership</option>
                        <option value="pt">Personal Training</option>
                        <option value="both">Membership + PT</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                        placeholder="Tell us about your fitness goals..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-premium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Contact Info */}
            <div className="space-y-8">
              <Reveal delay={0.1}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <a
                      href="tel:+962791234567"
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                        <Phone className="w-5 h-5 text-gold-400" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">Phone</p>
                        <p className="text-lg text-white group-hover:text-gold-400 transition-colors">
                          +962 79 123 4567
                        </p>
                      </div>
                    </a>

                    <a
                      href="mailto:info@gramsgym.com"
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                        <Mail className="w-5 h-5 text-gold-400" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">Email</p>
                        <p className="text-lg text-white group-hover:text-gold-400 transition-colors">
                          info@gramsgym.com
                        </p>
                      </div>
                    </a>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gold-400" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">Location</p>
                        <p className="text-lg text-white">Abdoun, Amman, Jordan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="glass-light rounded-2xl p-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gold-400" />
                    Working Hours
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Saturday - Thursday</span>
                      <span className="text-white">6:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Friday</span>
                      <span className="text-white">2:00 PM - 10:00 PM</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="glass-light rounded-2xl p-8">
                  <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <motion.a
                      href="https://instagram.com/gramsgym"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all"
                    >
                      <Instagram className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="glass-light rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <h3 className="text-lg font-semibold mb-2">Visit Us Today</h3>
                    <p className="text-zinc-400 text-sm mb-4">
                      Come see our facilities and meet our team. First visit is always free!
                    </p>
                    <Link href="/pricing">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-gold-400 hover:text-gold-300 font-medium flex items-center gap-2 transition-colors"
                      >
                        View Pricing
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-24 bg-zinc-950">
        <div className="container">
          <div className="rounded-2xl overflow-hidden h-96 bg-zinc-900 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent" />
            <div className="text-center relative">
              <MapPin className="w-16 h-16 text-gold-500/20 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg font-medium">Abdoun, Amman, Jordan</p>
              <p className="text-zinc-600 text-sm mt-2">Interactive map coming soon</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
