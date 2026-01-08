'use client'

import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LanguageToggleProps {
  variant?: 'default' | 'sidebar' | 'compact'
  className?: string
}

export function LanguageToggle({ variant = 'default', className }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage()

  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLanguage}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors',
          'text-sm font-medium',
          className
        )}
        title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      >
        <span className="text-gold-400">{language === 'en' ? 'ع' : 'EN'}</span>
      </motion.button>
    )
  }

  if (variant === 'sidebar') {
    return (
      <motion.button
        whileHover={{ x: 4 }}
        onClick={toggleLanguage}
        className={cn(
          'w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
          'text-zinc-400 hover:bg-zinc-800/50 hover:text-white',
          className
        )}
      >
        <Languages className="w-5 h-5" />
        <span>{language === 'en' ? 'العربية' : 'English'}</span>
        <span className="ml-auto text-xs text-zinc-500">
          {language === 'en' ? 'AR' : 'EN'}
        </span>
      </motion.button>
    )
  }

  // Default variant
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg',
        'text-sm font-medium text-zinc-300 hover:text-white',
        'hover:bg-zinc-800/50 transition-all',
        className
      )}
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Languages className="w-4 h-4" />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </motion.button>
  )
}
