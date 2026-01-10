'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Minimize2,
  Dumbbell,
  Sparkles,
  ImagePlus,
  FileImage,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Zap,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string // base64 image data URL
  timestamp?: Date
}

export function ChatWidget() {
  const { language, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Set initial message based on language
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = language === 'ar'
        ? "مرحبا! 💪 أنا مدرب جرامز الذكي\n\nارفع صورة InBody واحصل على خطتك المخصصة\nاسأل عن التمارين، التغذية، أو الماكروز\n\nيلا نبدأ!"
        : "Hey! 💪 I'm Grams Coach - your AI fitness expert\n\nUpload your InBody scan for personalized analysis\nAsk about workouts, nutrition, or macros\n\nLet's transform your fitness journey!"
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

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isLoading])

  // Focus input when chat opens
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

    // Add user message to chat
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage || (selectedImage ? 'Analyzing image...' : ''),
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
        ? 'عذراً، أواجه مشكلة حالياً. حاول مجدداً أو تواصل عبر واتساب!'
        : "I'm having trouble right now. Try again or reach us via WhatsApp!"
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
        ? "مرحبا مجدداً! 💪 كيف يمكنني مساعدتك اليوم؟"
        : "Welcome back! 💪 How can I help you today?",
      timestamp: new Date()
    }])
  }

  // Enhanced quick actions with categories
  const quickActions = language === 'ar' ? [
    { label: '📊 تحليل InBody', message: 'أريد رفع نتائج InBody للتحليل الكامل', category: 'analysis' },
    { label: '🏋️ برنامج تمارين', message: 'صمم لي برنامج تمارين متقدم لبناء العضلات', category: 'workout' },
    { label: '🥗 خطة غذائية', message: 'احسب الماكروز وصمم خطة غذائية مفصلة', category: 'nutrition' },
    { label: '💪 ابدأ الآن', message: 'أنا مبتدئ. ساعدني بخطة شاملة', category: 'beginner' },
    { label: '⚡ نصائح سريعة', message: 'أعطني 3 نصائح لتسريع النتائج', category: 'tips' },
    { label: '🎯 أسعار باقات', message: 'ما هي الباقات المتاحة والأسعار؟', category: 'info' },
  ] : [
    { label: '📊 InBody Analysis', message: 'I want to upload my InBody for complete analysis', category: 'analysis' },
    { label: '🏋️ Workout Program', message: 'Design an advanced muscle-building workout program for me', category: 'workout' },
    { label: '🥗 Meal Plan', message: 'Calculate macros and create a detailed meal plan', category: 'nutrition' },
    { label: '💪 Get Started', message: "I'm a beginner. Help me with a complete plan", category: 'beginner' },
    { label: '⚡ Quick Tips', message: 'Give me 3 tips to accelerate my results', category: 'tips' },
    { label: '🎯 Pricing & Packages', message: 'What packages and prices are available?', category: 'info' },
  ]

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 border-0 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <span className="absolute inset-0 rounded-full animate-ping bg-amber-400 opacity-20" />
              <div className="relative z-10 flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-white" />
                <Sparkles className="h-3 w-3 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </Button>

            {/* Enhanced Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 bg-white text-gray-900 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold whitespace-nowrap",
                "border border-amber-500/30",
                isRTL ? "left-20" : "right-20"
              )}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                {language === 'ar' ? 'اسأل خبير جرامز!' : 'Ask Grams Expert!'}
              </div>
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-amber-500/30",
                isRTL ? "left-0 -translate-x-1.5 border-r border-b" : "right-0 translate-x-1.5 border-l border-t"
              )} />
            </motion.div>
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
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="w-72 rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              <div className="p-3 flex items-center justify-between bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                    <Dumbbell className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-white">{language === 'ar' ? 'مدرب جرامز' : 'Grams Coach'}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => setIsMinimized(false)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[440px] max-w-[calc(100vw-3rem)] z-50"
          >
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col max-h-[650px]">
              {/* Enhanced Header */}
              <div className={cn("p-4 flex items-center justify-between bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shrink-0", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <div className="relative">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Dumbbell className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className={cn("font-bold text-white flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                      {language === 'ar' ? 'مدرب جرامز الذكي' : 'Grams AI Coach'}
                      <Sparkles className="h-3.5 w-3.5 text-yellow-200 animate-pulse" />
                    </p>
                    <p className="text-xs text-white/90 font-medium">{language === 'ar' ? 'خبير لياقة متقدم' : 'Elite Fitness Expert'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Restart conversation"
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                    onClick={handleRestart}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                    onClick={() => setIsMinimized(true)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-900/50 to-gray-900">
                <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.3 }}
                        className={cn(
                          'flex gap-2.5',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-amber-500/30">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="flex flex-col gap-1.5 max-w-[85%]">
                          <div
                            className={cn(
                              'rounded-2xl px-4 py-3 text-sm shadow-lg',
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                                : 'bg-gray-800/90 text-gray-100 border border-gray-700/50 backdrop-blur-sm'
                            )}
                          >
                            {message.image && (
                              <div className="mb-3 rounded-lg overflow-hidden border border-gray-700/50">
                                <Image
                                  src={message.image}
                                  alt="Uploaded image"
                                  width={250}
                                  height={180}
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                          </div>
                          {message.role === 'assistant' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCopyMessage(message.content, index)}
                                className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
                              >
                                {copiedIndex === index ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    {language === 'ar' ? 'تم النسخ' : 'Copied'}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    {language === 'ar' ? 'نسخ' : 'Copy'}
                                  </>
                                )}
                              </button>
                              {message.timestamp && (
                                <span className="text-xs text-gray-600">
                                  {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-JO' : 'en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-gray-600/30">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2.5 justify-start"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-amber-500/30">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-gray-800/90 border border-gray-700/50 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm">
                          <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Quick Actions */}
                  {messages.length <= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 space-y-3"
                    >
                      <div className="text-xs text-gray-500 font-medium px-1">
                        {language === 'ar' ? 'اختر موضوع:' : 'Quick start:'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quickActions.map((action) => (
                          <Button
                            key={action.label}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "text-xs bg-gray-800/60 border-gray-700 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:border-amber-500/50 text-gray-200 rounded-full transition-all duration-200 hover:scale-105",
                              action.category === 'analysis' && "hover:border-blue-500/50",
                              action.category === 'workout' && "hover:border-purple-500/50",
                              action.category === 'nutrition' && "hover:border-green-500/50"
                            )}
                            onClick={() => {
                              setInput(action.message)
                              setTimeout(() => handleSend(), 100)
                            }}
                            disabled={isLoading}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </ScrollArea>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 bg-gray-800/60 border-t border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Selected image"
                        width={70}
                        height={70}
                        className="rounded-lg object-cover ring-2 ring-amber-500/30"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className={cn("text-sm text-gray-300 flex items-center gap-2", isRTL && "flex-row-reverse")}>
                      <FileImage className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">{language === 'ar' ? 'جاهز للتحليل' : 'Ready to analyze'}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm shrink-0">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-gray-800/60 border-gray-700 hover:bg-gradient-to-br hover:from-amber-500/20 hover:to-orange-500/20 hover:border-amber-500/50 rounded-xl transition-all duration-200 hover:scale-105"
                    title={language === 'ar' ? 'رفع صورة InBody' : 'Upload InBody scan'}
                  >
                    <ImagePlus className="h-4 w-4 text-amber-500" />
                  </Button>

                  <Input
                    ref={inputRef}
                    placeholder={language === 'ar' ? 'اسأل عن التمارين، التغذية، أو الماكروز...' : 'Ask about workouts, nutrition, macros...'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="flex-1 bg-gray-800/60 border-gray-700 focus:border-amber-500/50 focus:ring-amber-500/20 text-white placeholder:text-gray-500 rounded-xl transition-all duration-200"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={(!input.trim() && !selectedImage) || isLoading}
                    className="bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-lg disabled:opacity-50 transition-all duration-200 hover:scale-105 hover:shadow-amber-500/50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Target className="h-3 w-3 text-amber-500" />
                    <span>{language === 'ar' ? 'تحليل InBody متقدم متاح' : 'Advanced InBody analysis available'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span>{language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
