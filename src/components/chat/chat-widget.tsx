'use client'

import { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Loader2, Minus, Plus, Copy, Check, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
  timestamp?: Date
}

export function ChatWidget() {
  const { language, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = language === 'ar'
        ? "مرحبا، أنا مساعدك الرياضي.\n\nيمكنك رفع صورة InBody للتحليل أو السؤال عن التمارين والتغذية."
        : "Hello, I'm your fitness assistant.\n\nUpload an InBody scan for analysis or ask about training and nutrition."
      setMessages([{ role: 'assistant', content: welcomeMessage, timestamp: new Date() }])
    }
  }, [language, messages.length])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(language === 'ar' ? 'الرجاء اختيار صورة' : 'Please select an image file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(language === 'ar' ? 'الصورة يجب أن تكون أقل من 10 ميجابايت' : 'Image must be less than 10MB')
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return

    const userMessage = input.trim()
    const userImage = imagePreview
    setInput('')

    const newUserMessage: Message = {
      role: 'user',
      content: userMessage || (selectedImage ? (language === 'ar' ? 'تحليل الصورة' : 'Analyzing image') : ''),
      image: userImage || undefined,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    const imageToSend = selectedImage
    removeImage()
    setIsLoading(true)

    try {
      let response: Response

      if (imageToSend) {
        const formData = new FormData()
        const imagePrompt = language === 'ar'
          ? 'حلل نتائج InBody بالتفصيل مع توصيات مخصصة'
          : 'Analyze this InBody result in detail with personalized recommendations'
        formData.append('message', userMessage || imagePrompt)
        formData.append('history', JSON.stringify(messages.map((m) => ({
          role: m.role,
          content: m.content,
        }))))
        formData.append('image', imageToSend)
        formData.append('language', language)

        response = await fetch('/api/chat', {
          method: 'POST',
          body: formData,
        })
      } else {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            language,
          }),
        })
      }

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }])
    } catch {
      const errorMessage = language === 'ar'
        ? 'عذراً، حدث خطأ. حاول مجدداً.'
        : "Something went wrong. Please try again."
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopyMessage = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleRestart = () => {
    setMessages([{
      role: 'assistant',
      content: language === 'ar'
        ? "مرحبا مجدداً. كيف يمكنني مساعدتك؟"
        : "Welcome back. How can I help you?",
      timestamp: new Date()
    }])
  }

  const quickActions = language === 'ar' ? [
    { label: 'تحليل InBody', message: 'أريد رفع نتائج InBody للتحليل' },
    { label: 'برنامج تمارين', message: 'صمم لي برنامج تمارين' },
    { label: 'خطة غذائية', message: 'احسب الماكروز وصمم خطة غذائية' },
    { label: 'الأسعار', message: 'ما هي الباقات والأسعار المتاحة؟' },
  ] : [
    { label: 'InBody Analysis', message: 'I want to upload my InBody for analysis' },
    { label: 'Workout Plan', message: 'Design a workout program for me' },
    { label: 'Nutrition', message: 'Calculate macros and create a meal plan' },
    { label: 'Pricing', message: 'What packages and prices are available?' },
  ]

  return (
    <>
      {/* Floating Action Button - Minimal */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 shadow-2xl transition-all duration-300 flex items-center justify-center group"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 sm:h-7 sm:w-7 text-neutral-100 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
          >
            <div className="w-64 sm:w-72 rounded-xl shadow-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
              <div className="px-4 py-3 flex items-center justify-between">
                <span className={cn(
                  "text-sm font-medium text-neutral-200 tracking-wide",
                  isRTL && "font-arabic"
                )}>
                  {language === 'ar' ? 'المساعد' : 'Assistant'}
                </span>
                <div className="flex gap-1">
                  <button
                    className="h-7 w-7 flex items-center justify-center text-neutral-400 hover:text-neutral-200 transition-colors"
                    onClick={() => setIsMinimized(false)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    className="h-7 w-7 flex items-center justify-center text-neutral-400 hover:text-neutral-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[420px] z-50"
          >
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-neutral-800 bg-neutral-950 flex flex-col h-[min(600px,calc(100vh-6rem))] sm:h-[580px]">
              {/* Header - Minimal */}
              <div className={cn(
                "px-5 py-4 flex items-center justify-between border-b border-neutral-800/50 shrink-0",
                isRTL && "flex-row-reverse"
              )}>
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className={cn(
                    "text-sm font-medium text-neutral-200 tracking-wide",
                    isRTL && "font-arabic"
                  )}>
                    {language === 'ar' ? 'مساعد جرامز' : 'Grams Assistant'}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    className="h-8 w-8 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors rounded-lg hover:bg-neutral-800/50"
                    onClick={handleRestart}
                    title={language === 'ar' ? 'محادثة جديدة' : 'New chat'}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    className="h-8 w-8 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors rounded-lg hover:bg-neutral-800/50"
                    onClick={() => setIsMinimized(true)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    className="h-8 w-8 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors rounded-lg hover:bg-neutral-800/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollRef}>
                  <div className="p-4 space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.2 }}
                        className={cn(
                          'flex gap-3',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div className={cn(
                          "flex flex-col gap-1 max-w-[85%]",
                          message.role === 'user' && "items-end"
                        )}>
                          <div
                            className={cn(
                              'rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed',
                              message.role === 'user'
                                ? 'bg-neutral-200 text-neutral-900'
                                : 'bg-neutral-800/80 text-neutral-100'
                            )}
                          >
                            {message.image && (
                              <div className="mb-2.5 rounded-lg overflow-hidden">
                                <Image
                                  src={message.image}
                                  alt="Uploaded"
                                  width={220}
                                  height={160}
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                          {message.role === 'assistant' && (
                            <button
                              onClick={() => handleCopyMessage(message.content, index)}
                              className="text-[11px] text-neutral-600 hover:text-neutral-400 flex items-center gap-1 transition-colors px-1"
                            >
                              {copiedIndex === index ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  <span>{language === 'ar' ? 'تم' : 'Copied'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                      >
                        <div className="bg-neutral-800/80 rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-pulse" />
                            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {messages.length <= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="px-4 pb-4"
                    >
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map((action) => (
                          <button
                            key={action.label}
                            className="text-xs px-3 py-1.5 rounded-full border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600 hover:bg-neutral-800/50 transition-all duration-200"
                            onClick={() => {
                              setInput(action.message)
                              setTimeout(() => handleSend(), 100)
                            }}
                            disabled={isLoading}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </ScrollArea>
              </div>

              {/* Image Preview */}
              <AnimatePresence>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-3 border-t border-neutral-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Selected"
                          width={56}
                          height={56}
                          className="rounded-lg object-cover"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 rounded-full text-neutral-300 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs text-neutral-500">
                        {language === 'ar' ? 'جاهز للتحليل' : 'Ready to analyze'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <div className="p-3 border-t border-neutral-800/50 shrink-0">
                <div className="flex items-center gap-2 bg-neutral-900 rounded-xl border border-neutral-800 focus-within:border-neutral-700 transition-colors p-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="h-9 w-9 flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-colors rounded-lg hover:bg-neutral-800/50 disabled:opacity-50"
                    title={language === 'ar' ? 'رفع صورة' : 'Upload image'}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <input
                    ref={inputRef}
                    placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none py-2"
                  />

                  <button
                    onClick={handleSend}
                    disabled={(!input.trim() && !selectedImage) || isLoading}
                    className="h-9 w-9 flex items-center justify-center bg-neutral-100 hover:bg-white text-neutral-900 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
