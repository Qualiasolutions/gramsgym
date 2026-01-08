'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTranslation, translations } from '@/lib/i18n'
import { LanguageToggle } from '@/components/ui/language-toggle'

const navLinks = [
  { href: '/', labelKey: 'home' as const },
  { href: '/about', labelKey: 'about' as const },
  { href: '/coaches', labelKey: 'coaches' as const },
  { href: '/contact', labelKey: 'contact' as const },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t, isRTL } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'py-2 glass'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="container">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center"
              >
                <div className="relative w-[100px] h-[36px] sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[48px] bg-noir-950 rounded-lg p-1">
                  <Image
                    src="/logo.png"
                    alt="Grams Gym"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`relative px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                      pathname === link.href
                        ? 'text-champagne-400'
                        : 'text-noir-300 hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t(translations.nav[link.labelKey])}
                    {pathname === link.href && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-champagne-500"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* CTA + Language + Mobile Menu Button */}
            <div className={`flex items-center gap-2 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Language Toggle - Desktop */}
              <div className="hidden md:block">
                <LanguageToggle variant="compact" />
              </div>

              <Link href="/member/login" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2 text-sm font-medium text-noir-300 hover:text-champagne-400 transition-colors duration-300"
                >
                  {t(translations.nav.signIn)}
                </motion.button>
              </Link>
              <Link href="/contact" className="hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(201, 169, 108, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium text-sm py-2.5 px-6"
                >
                  <span>{t(translations.nav.startToday)}</span>
                </motion.button>
              </Link>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative z-10 p-2 -mr-2 text-foreground"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-noir-950/95 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full sm:max-w-sm bg-noir-900/98 backdrop-blur-2xl sm:border-l border-noir-800"
            >
              <div className={`flex flex-col h-full pt-20 sm:pt-24 pb-8 sm:pb-10 px-6 sm:px-8 ${isRTL ? 'text-right' : ''}`}>
                <div className="flex-1 flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={link.href}
                        className={`block py-4 text-xl sm:text-2xl font-medium transition-colors duration-300 min-h-[48px] flex items-center ${
                          pathname === link.href
                            ? 'text-champagne-400'
                            : 'text-noir-300 hover:text-foreground'
                        }`}
                      >
                        {t(translations.nav[link.labelKey])}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t border-noir-800"
                >
                  {/* Language Toggle - Mobile */}
                  <LanguageToggle className="w-full justify-center bg-zinc-800/50 rounded-lg py-3 min-h-[48px]" />

                  <Link href="/member/login" className="block">
                    <button className="w-full btn-ghost py-3 min-h-[48px]">
                      {t(translations.nav.signIn)}
                    </button>
                  </Link>
                  <Link href="/contact" className="block">
                    <button className="w-full btn-premium py-3 min-h-[48px]">
                      <span>{t(translations.nav.startToday)}</span>
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
