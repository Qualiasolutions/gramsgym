'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { LoadingScreen } from '@/components/ui/loading-screen'

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: React.ReactNode
  initialLoadDuration?: number
  pageTransitionDuration?: number
}

export function LoadingProvider({
  children,
  initialLoadDuration = 800, // 800ms for initial load (reduced from 3s for performance)
  pageTransitionDuration = 400, // 400ms for page transitions (reduced from 1s)
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Handle initial page load
  useEffect(() => {
    // Check if this is a fresh page load (not a navigation)
    const hasVisited = sessionStorage.getItem('gramsgym_visited')

    if (!hasVisited) {
      // First visit - show 3 second loading
      sessionStorage.setItem('gramsgym_visited', 'true')
      const timer = setTimeout(() => {
        setIsLoading(false)
        setIsInitialLoad(false)
      }, initialLoadDuration)
      return () => clearTimeout(timer)
    } else {
      // Already visited - skip initial loading
      setIsLoading(false)
      setIsInitialLoad(false)
    }
  }, [initialLoadDuration])

  // Handle page transitions
  useEffect(() => {
    if (isInitialLoad) return

    // Show loading on route change
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, pageTransitionDuration)

    return () => clearTimeout(timer)
  }, [pathname, searchParams, isInitialLoad, pageTransitionDuration])

  const handleSetLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading: handleSetLoading }}>
      <LoadingScreen isVisible={isLoading} />
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </LoadingContext.Provider>
  )
}
