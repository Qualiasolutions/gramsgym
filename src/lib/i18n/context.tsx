'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { type Language } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'gramsgym_language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored && (stored === 'en' || stored === 'ar')) {
      setLanguageState(stored)
    }
    setMounted(true)
  }, [])

  // Update localStorage and document direction when language changes
  useEffect(() => {
    if (!mounted) return

    localStorage.setItem(STORAGE_KEY, language)

    // Update HTML attributes for RTL support
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language, mounted])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'en' ? 'ar' : 'en')
  }, [])

  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook for easy translation access
export function useTranslation() {
  const { language, isRTL } = useLanguage()

  const t = useCallback(<T extends { en: string; ar: string }>(translation: T): string => {
    return translation[language]
  }, [language])

  return { t, language, isRTL }
}
