'use client'

import { motion, useInView, type HTMLMotionProps } from 'framer-motion'
import { useRef, useState, useEffect, type ReactNode } from 'react'

// Premium easing curve for luxury feel
const easeLuxe: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Fade up animation component
interface FadeUpProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  duration?: number
}

export function FadeUp({ children, delay = 0, duration = 0.7, ...props }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: easeLuxe,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Reveal on scroll component
interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function Reveal({ children, delay = 0, direction = 'up', ...props }: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 50 },
    right: { x: -50 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay,
        ease: easeLuxe,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger container
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  staggerDelay?: number
  delayChildren?: number
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  delayChildren = 0.2,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger item (use inside StaggerContainer)
interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode
}

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: easeLuxe,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Scale on hover
interface ScaleOnHoverProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  scale?: number
}

export function ScaleOnHover({ children, scale = 1.02, ...props }: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Text reveal animation
interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  const words = text.split(' ')

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            variants={{
              hidden: { y: '100%' },
              visible: {
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </motion.span>
  )
}

// Parallax wrapper
interface ParallaxProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  offset?: number
}

export function Parallax({ children, offset = 50, ...props }: ParallaxProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ y: offset }}
      animate={isInView ? { y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Magnetic hover effect
interface MagneticProps {
  children: ReactNode
  className?: string
}

export function Magnetic({ children, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  )
}

// Counter animation using useSpring
interface CounterProps {
  value: number
  duration?: number
  className?: string
}

export function Counter({ value, duration = 2, className = '' }: CounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const incrementTime = (duration * 1000) / end
      const timer = setInterval(() => {
        start += 1
        setDisplayValue(start)
        if (start >= end) {
          clearInterval(timer)
        }
      }, Math.max(incrementTime, 10))
      return () => clearInterval(timer)
    }
  }, [isInView, value, duration])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {displayValue}
    </motion.span>
  )
}

// Blur fade
interface BlurFadeProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
}

export function BlurFade({ children, delay = 0, ...props }: BlurFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: easeLuxe,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
