'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Phone, Mail, MapPin } from 'lucide-react'

const footerLinks = {
  explore: [
    { href: '/about', label: 'About Us' },
    { href: '/coaches', label: 'Our Coaches' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ],
  members: [
    { href: '/member/login', label: 'Member Login' },
    { href: '/coach/login', label: 'Coach Portal' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/50">
      {/* Top section with CTA */}
      <div className="container py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
              Ready to <span className="text-gradient">Transform?</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-8 max-w-md">
              Join Grams Gym today and take the first step toward becoming your best self.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(212, 164, 74, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="btn-premium"
              >
                <span>Get Started</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-light rounded-2xl p-8"
          >
            <h3 className="text-sm font-medium text-gold-400 uppercase tracking-wider mb-6">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+962"
                className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                  <Phone className="w-4 h-4 text-gold-400" />
                </div>
                <span>+962 XX XXX XXXX</span>
              </a>
              <a
                href="mailto:info@gramsgym.com"
                className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                  <Mail className="w-4 h-4 text-gold-400" />
                </div>
                <span>info@gramsgym.com</span>
              </a>
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gold-400" />
                </div>
                <span>Amman, Jordan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* Links Section */}
      <div className="container py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <span className="text-black font-bold text-xl">G</span>
                </div>
                <span className="text-xl font-semibold tracking-tight">
                  Grams<span className="text-gold-400">Gym</span>
                </span>
              </div>
            </Link>
            <p className="text-zinc-500 max-w-sm mb-6">
              Each gram matters. Premium fitness training in Amman, Jordan since 2014.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <motion.a
                href="https://instagram.com/gramsgym"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Links */}
          <div>
            <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider mb-4">
              Members
            </h4>
            <ul className="space-y-3">
              {footerLinks.members.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-600">
          <p>&copy; {currentYear} Grams Gym. All rights reserved.</p>
          <p className="text-zinc-700">
            Each Gram Matters
          </p>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
    </footer>
  )
}
