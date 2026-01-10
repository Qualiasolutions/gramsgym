import { z } from 'zod'

// Common validation patterns
const uuidSchema = z.string().uuid()
const emailSchema = z.string().email()
const phoneSchema = z.string().regex(/^\+?[0-9\s-]{7,15}$/).optional().or(z.literal(''))

// Member schemas
export const createMemberSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
  name_en: z.string().min(1).max(100),
  name_ar: z.string().min(1).max(100),
  phone: phoneSchema,
  whatsapp_number: phoneSchema,
  assigned_coach_id: uuidSchema.optional().or(z.literal('')),
  preferred_language: z.enum(['ar', 'en']).default('ar'),
  notification_preference: z.enum(['whatsapp', 'email', 'both']).default('whatsapp'),
})

export const updateMemberSchema = z.object({
  name_en: z.string().min(1).max(100),
  name_ar: z.string().min(1).max(100),
  phone: phoneSchema,
  whatsapp_number: phoneSchema,
  assigned_coach_id: uuidSchema.optional().or(z.literal('')),
  preferred_language: z.enum(['ar', 'en']).default('ar'),
  notification_preference: z.enum(['whatsapp', 'email', 'both']).default('whatsapp'),
})

// Booking schemas
export const createBookingSchema = z.object({
  member_id: uuidSchema,
  coach_id: uuidSchema,
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().int().min(15).max(240).default(60),
  notes: z.string().max(500).optional(),
})

// Subscription schemas
export const createGymMembershipSchema = z.object({
  member_id: uuidSchema,
  type: z.enum(['monthly', 'quarterly', 'yearly']),
  price_paid: z.number().nonnegative().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const createPTPackageSchema = z.object({
  member_id: uuidSchema,
  coach_id: uuidSchema,
  total_sessions: z.number().int().min(1).max(100),
  price_paid: z.number().nonnegative().optional(),
})

// Settings schemas
export const updateGymSettingsSchema = z.object({
  id: uuidSchema.optional().or(z.literal('')),
  name_en: z.string().min(1).max(200),
  name_ar: z.string().min(1).max(200),
  description_en: z.string().max(1000).optional().or(z.literal('')),
  description_ar: z.string().max(1000).optional().or(z.literal('')),
  address_en: z.string().max(500).optional().or(z.literal('')),
  address_ar: z.string().max(500).optional().or(z.literal('')),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  instagram: z.string().max(100).optional().or(z.literal('')),
  whatsapp: phoneSchema,
})

export const createPricingSchema = z.object({
  name_en: z.string().min(1).max(100),
  name_ar: z.string().min(1).max(100),
  type: z.string().min(1),
  duration_or_sessions: z.string().optional().or(z.literal('')),
  price: z.number().nonnegative(),
  is_active: z.boolean().default(true),
})

// Coach availability schema
export const updateCoachAvailabilitySchema = z.object({
  coach_id: uuidSchema,
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_available: z.boolean(),
})

// Helper to parse FormData with Zod schema
export function parseFormData<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  formData: FormData
) {
  const data: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) {
    // Handle numeric fields
    if (['price', 'price_paid', 'total_sessions', 'duration_minutes', 'day_of_week'].includes(key)) {
      data[key] = value === '' ? undefined : parseFloat(value as string)
    }
    // Handle boolean fields
    else if (['is_available', 'is_active'].includes(key)) {
      data[key] = value === 'on' || value === 'true'
    }
    // Handle string fields
    else {
      data[key] = value as string
    }
  }

  return schema.safeParse(data)
}

// Helper to format Zod errors
export function formatZodErrors(error: z.ZodError<unknown>): string {
  return error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')
}

// Type exports
export type CreateMemberInput = z.infer<typeof createMemberSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CreateGymMembershipInput = z.infer<typeof createGymMembershipSchema>
export type CreatePTPackageInput = z.infer<typeof createPTPackageSchema>
