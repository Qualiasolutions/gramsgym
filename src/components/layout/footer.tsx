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
    <footer className="relative bg-noir-950 border-t border-noir-800/50">
      {/* Top section with CTA */}
      <div className="container py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-6 leading-[1.1]">
              Ready to <span className="text-gradient italic">Transform?</span>
            </h2>
            <p className="text-lg text-noir-300 mb-10 max-w-md leading-relaxed">
              Join Grams Gym today and take the first step toward becoming your best self.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 15px 50px rgba(201, 169, 108, 0.3)' }}
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
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="card-glass rounded-2xl p-10"
          >
            <h3 className="text-xs font-medium text-champagne-500 uppercase tracking-[0.2em] mb-8">
              Get in Touch
            </h3>
            <div className="space-y-5">
              <a
                href="tel:+962"
                className="flex items-center gap-4 text-noir-200 hover:text-foreground transition-colors duration-300 group"
              >
                <div className="w-11 h-11 rounded-full bg-noir-800 flex items-center justify-center group-hover:bg-champagne-500/10 transition-colors duration-300 border border-noir-700 group-hover:border-champagne-500/30">
                  <Phone className="w-4 h-4 text-champagne-400" />
                </div>
                <span>+962 XX XXX XXXX</span>
              </a>
              <a
                href="mailto:info@gramsgym.com"
                className="flex items-center gap-4 text-noir-200 hover:text-foreground transition-colors duration-300 group"
              >
                <div className="w-11 h-11 rounded-full bg-noir-800 flex items-center justify-center group-hover:bg-champagne-500/10 transition-colors duration-300 border border-noir-700 group-hover:border-champagne-500/30">
                  <Mail className="w-4 h-4 text-champagne-400" />
                </div>
                <span>info@gramsgym.com</span>
              </a>
              <div className="flex items-center gap-4 text-noir-200">
                <div className="w-11 h-11 rounded-full bg-noir-800 flex items-center justify-center border border-noir-700">
                  <MapPin className="w-4 h-4 text-champagne-400" />
                </div>
                <span>Amman, Jordan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="container">
        <div className="divider" />
      </div>

      {/* Links Section */}
      <div className="container py-20">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-champagne-400 to-champagne-600 flex items-center justify-center shadow-lg shadow-champagne-500/20">
                  <span className="text-noir-950 font-bold text-xl">G</span>
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  Grams<span className="text-champagne-400">Gym</span>
                </span>
              </div>
            </Link>
            <p className="text-noir-400 max-w-sm mb-8 leading-relaxed">
              Each gram matters. Premium fitness training in Amman, Jordan since 2014.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <motion.a
                href="https://instagram.com/gramsgym"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-full bg-noir-800 border border-noir-700 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-xs font-medium text-noir-200 uppercase tracking-[0.2em] mb-6">
              Explore
            </h4>
            <ul className="space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-noir-400 hover:text-champagne-400 transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Links */}
          <div>
            <h4 className="text-xs font-medium text-noir-200 uppercase tracking-[0.2em] mb-6">
              Members
            </h4>
            <ul className="space-y-4">
              {footerLinks.members.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-noir-400 hover:text-champagne-400 transition-colors duration-300 text-sm"
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
      <div className="container pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-noir-500">
          <p>&copy; {currentYear} Grams Gym. All rights reserved.</p>
          <p className="text-noir-600 italic font-display">
            Each Gram Matters
          </p>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-champagne-500/30 to-transparent" />
    </footer>
  )
}
