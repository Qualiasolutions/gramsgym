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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string // base64 image data URL
}

export function ChatWidget() {
  const { language, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  // Set initial message based on language
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = language === 'ar'
        ? "أهلاً! 💪 أنا مدرب جرامز الذكي.\n\nارفع نتائج InBody الخاصة بك واحصل على خطتك. يلا نبدأ!"
        : "Hey! 💪 I'm Grams Coach.\n\nUpload your InBody, get your plan. Let's go!"
      setMessages([{ role: 'assistant', content: welcomeMessage }])
    }
  }, [language, messages.length])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB')
        return
      }
      setSelectedImage(file)
      // Create preview
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
      content: userMessage || (selectedImage ? 'Please analyze this image.' : ''),
      image: userImage || undefined,
    }
    setMessages((prev) => [...prev, newUserMessage])

    // Clear image after sending
    const imageToSend = selectedImage
    removeImage()
    setIsLoading(true)

    try {
      let response: Response

      if (imageToSend) {
        // Send with FormData for image upload
        const formData = new FormData()
        const imagePrompt = language === 'ar'
          ? 'الرجاء تحليل نتائج فحص InBody هذه وتقديم توصيات مفصلة.'
          : 'Please analyze this InBody test result and provide detailed recommendations.'
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
        // Send regular JSON request
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
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
    } catch {
      const errorMessage = language === 'ar'
        ? 'عذراً، أواجه مشكلة في الاتصال الآن. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة عبر واتساب!'
        : "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly via WhatsApp!"
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
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

  // Quick action buttons - fitness focused (bilingual)
  const quickActions = language === 'ar' ? [
    { label: '📊 تحليل InBody', message: 'أريد رفع نتائج فحص InBody للتحليل' },
    { label: '🏋️ خطة تمارين', message: 'أنشئ لي خطة تمارين لبناء العضلات بناءً على أهدافي' },
    { label: '🥗 خطة غذائية', message: 'احسب السعرات والماكروز وأنشئ لي خطة غذائية مخصصة' },
    { label: '💪 ابدأ الآن', message: 'أنا جديد في اللياقة. ساعدني في إنشاء خطة كاملة' },
  ] : [
    { label: '📊 Analyze InBody', message: 'I want to upload my InBody test for analysis' },
    { label: '🏋️ Workout Plan', message: 'Create a workout plan for muscle building based on my goals' },
    { label: '🥗 Meal Plan', message: 'Calculate my macros and create a personalized meal plan' },
    { label: '💪 Get Started', message: "I'm new to fitness. Help me create a complete plan" },
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
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full animate-ping bg-amber-400 opacity-20" />

              {/* Icon */}
              <div className="relative z-10 flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-white" />
                <Sparkles className="h-3 w-3 text-yellow-200 absolute -top-1 -right-1" />
              </div>
            </Button>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap",
                isRTL ? "left-20" : "right-20"
              )}
            >
              {language === 'ar' ? '💪 اسأل مدرب جرامز!' : 'Ask Grams Coach! 💪'}
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45",
                isRTL ? "left-0 -translate-x-1" : "right-0 translate-x-1"
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
            className="fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-3rem)] z-50"
          >
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col max-h-[600px]">
              {/* Header with gradient */}
              <div className={cn("p-4 flex items-center justify-between bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shrink-0", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Dumbbell className="h-5 w-5 text-white" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className={cn("font-bold text-white flex items-center gap-1", isRTL && "flex-row-reverse")}>
                      {language === 'ar' ? 'مدرب جرامز' : 'Grams Coach'}
                      <Sparkles className="h-3 w-3 text-yellow-200" />
                    </p>
                    <p className="text-xs text-white/80">{language === 'ar' ? 'خبير لياقة بالذكاء الاصطناعي' : 'Elite AI Fitness Expert'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
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
                <ScrollArea className="h-[380px] p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'flex gap-2',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3 max-w-[85%] text-sm shadow-lg',
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                              : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
                          )}
                        >
                          {message.image && (
                            <div className="mb-2 rounded-lg overflow-hidden">
                              <Image
                                src={message.image}
                                alt="Uploaded image"
                                width={200}
                                height={150}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shrink-0 shadow-lg">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 justify-start"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl px-4 py-3 shadow-lg">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Quick Actions - only show at start */}
                  {messages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 flex flex-wrap gap-2"
                    >
                      {quickActions.map((action) => (
                        <Button
                          key={action.label}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-amber-500/50 text-gray-200 rounded-full"
                          onClick={() => {
                            setInput(action.message)
                            setTimeout(() => handleSend(), 100)
                          }}
                          disabled={isLoading}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </ScrollArea>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Selected image"
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <div className={cn("text-xs text-gray-400", isRTL ? "mr-0 ml-1" : "")}>
                      <FileImage className={cn("h-4 w-4 inline", isRTL ? "ml-1" : "mr-1")} />
                      {language === 'ar' ? 'الصورة جاهزة للإرسال' : 'Image ready to send'}
                    </div>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm shrink-0">
                <div className="flex gap-2">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Image upload button */}
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-amber-500/50 rounded-xl"
                    title="Upload InBody test or image"
                  >
                    <ImagePlus className="h-4 w-4 text-amber-500" />
                  </Button>

                  <Input
                    ref={inputRef}
                    placeholder={language === 'ar' ? 'اسأل عن التمارين، التغذية، أو ارفع InBody...' : 'Ask about workouts, nutrition, or upload InBody...'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="flex-1 bg-gray-800/50 border-gray-700 focus:border-amber-500/50 focus:ring-amber-500/20 text-white placeholder:text-gray-500 rounded-xl"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={(!input.trim() && !selectedImage) || isLoading}
                    className="bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center">
                  {language === 'ar' ? 'مدعوم بـ Claude AI • ارفع InBody للتحليل' : 'Powered by Claude AI • Upload InBody for analysis'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
