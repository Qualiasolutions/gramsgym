'use client'

import Link from 'next/link'
import Image from 'next/image'
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
      <div className="container py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium mb-4 sm:mb-6 leading-[1.1]">
              Ready to <span className="text-gradient italic">Transform?</span>
            </h2>
            <p className="text-base sm:text-lg text-noir-300 mb-6 sm:mb-8 md:mb-10 max-w-md leading-relaxed">
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
            className="card-glass rounded-2xl p-6 sm:p-8 md:p-10"
          >
            <h3 className="text-xs font-medium text-champagne-500 uppercase tracking-[0.2em] mb-5 sm:mb-6 md:mb-8">
              Get in Touch
            </h3>
            <div className="space-y-4 sm:space-y-5">
              <a
                href="tel:+962795556818"
                className="flex items-center gap-3 sm:gap-4 text-noir-200 hover:text-foreground transition-colors duration-300 group min-h-[44px]"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-noir-800 flex items-center justify-center group-hover:bg-champagne-500/10 transition-colors duration-300 border border-noir-700 group-hover:border-champagne-500/30 flex-shrink-0">
                  <Phone className="w-4 h-4 text-champagne-400" />
                </div>
                <span className="text-sm sm:text-base">+962 7 9555 6818</span>
              </a>
              <a
                href="mailto:arashed84@hotmail.com"
                className="flex items-center gap-3 sm:gap-4 text-noir-200 hover:text-foreground transition-colors duration-300 group min-h-[44px]"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-noir-800 flex items-center justify-center group-hover:bg-champagne-500/10 transition-colors duration-300 border border-noir-700 group-hover:border-champagne-500/30 flex-shrink-0">
                  <Mail className="w-4 h-4 text-champagne-400" />
                </div>
                <span className="text-sm sm:text-base break-all">arashed84@hotmail.com</span>
              </a>
              <div className="flex items-center gap-3 sm:gap-4 text-noir-200 min-h-[44px]">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-noir-800 flex items-center justify-center border border-noir-700 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-champagne-400" />
                </div>
                <span className="text-sm sm:text-base">Mukhaled Ar Rawashdeh, Amman, Jordan</span>
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
      <div className="container py-10 sm:py-14 md:py-16 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-5 sm:mb-6 md:mb-8">
              <div className="relative w-[120px] h-[40px] sm:w-[140px] sm:h-[48px] bg-noir-950 rounded-lg">
                <Image
                  src="/logo.png"
                  alt="Grams Gym"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-noir-400 max-w-sm mb-5 sm:mb-6 md:mb-8 leading-relaxed text-sm sm:text-base">
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
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-noir-800 border border-noir-700 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all duration-300 min-h-[44px] min-w-[44px]"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-xs font-medium text-noir-200 uppercase tracking-[0.2em] mb-4 sm:mb-5 md:mb-6">
              Explore
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-noir-400 hover:text-champagne-400 transition-colors duration-300 text-sm py-1 inline-block min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Links */}
          <div>
            <h4 className="text-xs font-medium text-noir-200 uppercase tracking-[0.2em] mb-4 sm:mb-5 md:mb-6">
              Members
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {footerLinks.members.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-noir-400 hover:text-champagne-400 transition-colors duration-300 text-sm py-1 inline-block min-h-[44px] flex items-center"
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
      <div className="container pb-6 sm:pb-8 md:pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-noir-500">
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
