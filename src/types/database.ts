export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      coaches: {
        Row: {
          id: string
          email: string
          phone: string | null
          whatsapp_number: string | null
          name_en: string
          name_ar: string
          bio_en: string | null
          bio_ar: string | null
          specialty_en: string | null
          specialty_ar: string | null
          specialization: string | null
          profile_photo_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          whatsapp_number?: string | null
          name_en: string
          name_ar: string
          bio_en?: string | null
          bio_ar?: string | null
          specialty_en?: string | null
          specialty_ar?: string | null
          specialization?: string | null
          profile_photo_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          whatsapp_number?: string | null
          name_en?: string
          name_ar?: string
          bio_en?: string | null
          bio_ar?: string | null
          specialty_en?: string | null
          specialty_ar?: string | null
          specialization?: string | null
          profile_photo_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      members: {
        Row: {
          id: string
          email: string
          phone: string | null
          whatsapp_number: string | null
          name_en: string
          name_ar: string
          bio_en: string | null
          bio_ar: string | null
          profile_photo_url: string | null
          assigned_coach_id: string | null
          preferred_language: 'ar' | 'en'
          notification_preference: 'whatsapp' | 'email' | 'both'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          whatsapp_number?: string | null
          name_en: string
          name_ar: string
          bio_en?: string | null
          bio_ar?: string | null
          profile_photo_url?: string | null
          assigned_coach_id?: string | null
          preferred_language?: 'ar' | 'en'
          notification_preference?: 'whatsapp' | 'email' | 'both'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          whatsapp_number?: string | null
          name_en?: string
          name_ar?: string
          bio_en?: string | null
          bio_ar?: string | null
          profile_photo_url?: string | null
          assigned_coach_id?: string | null
          preferred_language?: 'ar' | 'en'
          notification_preference?: 'whatsapp' | 'email' | 'both'
          created_at?: string
        }
      }
      gym_memberships: {
        Row: {
          id: string
          member_id: string
          type: 'monthly' | 'quarterly' | 'yearly'
          start_date: string
          end_date: string
          price_paid: number | null
          status: 'active' | 'expired' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          type: 'monthly' | 'quarterly' | 'yearly'
          start_date: string
          end_date: string
          price_paid?: number | null
          status?: 'active' | 'expired' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          type?: 'monthly' | 'quarterly' | 'yearly'
          start_date?: string
          end_date?: string
          price_paid?: number | null
          status?: 'active' | 'expired' | 'cancelled'
          created_at?: string
        }
      }
      pt_packages: {
        Row: {
          id: string
          member_id: string
          coach_id: string
          total_sessions: number
          remaining_sessions: number
          price_paid: number | null
          purchased_at: string
          status: 'active' | 'completed' | 'expired'
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          coach_id: string
          total_sessions: number
          remaining_sessions: number
          price_paid?: number | null
          purchased_at?: string
          status?: 'active' | 'completed' | 'expired'
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          coach_id?: string
          total_sessions?: number
          remaining_sessions?: number
          price_paid?: number | null
          purchased_at?: string
          status?: 'active' | 'completed' | 'expired'
          created_at?: string
        }
      }
      coach_availability: {
        Row: {
          id: string
          coach_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          coach_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          coach_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          member_id: string
          coach_id: string
          pt_package_id: string | null
          scheduled_at: string
          duration_minutes: number
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          coach_id: string
          pt_package_id?: string | null
          scheduled_at: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          coach_id?: string
          pt_package_id?: string | null
          scheduled_at?: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
        }
      }
      notifications_log: {
        Row: {
          id: string
          member_id: string
          type: string
          channel: 'whatsapp' | 'email'
          message_content: string | null
          status: 'pending' | 'sent' | 'failed'
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          type: string
          channel: 'whatsapp' | 'email'
          message_content?: string | null
          status?: 'pending' | 'sent' | 'failed'
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          type?: string
          channel?: 'whatsapp' | 'email'
          message_content?: string | null
          status?: 'pending' | 'sent' | 'failed'
          sent_at?: string | null
          created_at?: string
        }
      }
      gym_info: {
        Row: {
          id: string
          key: string
          value_en: string
          value_ar: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value_en: string
          value_ar: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value_en?: string
          value_ar?: string
          updated_at?: string
        }
      }
      gym_settings: {
        Row: {
          id: string
          name_en: string
          name_ar: string
          description_en: string | null
          description_ar: string | null
          address_en: string | null
          address_ar: string | null
          phone: string | null
          email: string | null
          instagram: string | null
          whatsapp: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ar: string
          description_en?: string | null
          description_ar?: string | null
          address_en?: string | null
          address_ar?: string | null
          phone?: string | null
          email?: string | null
          instagram?: string | null
          whatsapp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ar?: string
          description_en?: string | null
          description_ar?: string | null
          address_en?: string | null
          address_ar?: string | null
          phone?: string | null
          email?: string | null
          instagram?: string | null
          whatsapp?: string | null
          created_at?: string
        }
      }
      gym_working_hours: {
        Row: {
          id: string
          day_of_week: number
          open_time: string | null
          close_time: string | null
          is_closed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          day_of_week: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          day_of_week?: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean
          created_at?: string
        }
      }
      pricing: {
        Row: {
          id: string
          name_en: string
          name_ar: string
          type: 'gym_membership' | 'pt_package'
          duration_or_sessions: string | null
          price: number
          is_active: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ar: string
          type: 'gym_membership' | 'pt_package'
          duration_or_sessions?: string | null
          price: number
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ar?: string
          type?: 'gym_membership' | 'pt_package'
          duration_or_sessions?: string | null
          price?: number
          is_active?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Coach = Database['public']['Tables']['coaches']['Row']
export type CoachInsert = Database['public']['Tables']['coaches']['Insert']
export type CoachUpdate = Database['public']['Tables']['coaches']['Update']

export type Member = Database['public']['Tables']['members']['Row']
export type MemberInsert = Database['public']['Tables']['members']['Insert']
export type MemberUpdate = Database['public']['Tables']['members']['Update']

export type GymMembership = Database['public']['Tables']['gym_memberships']['Row']
export type GymMembershipInsert = Database['public']['Tables']['gym_memberships']['Insert']
export type GymMembershipUpdate = Database['public']['Tables']['gym_memberships']['Update']

export type PTPackage = Database['public']['Tables']['pt_packages']['Row']
export type PTPackageInsert = Database['public']['Tables']['pt_packages']['Insert']
export type PTPackageUpdate = Database['public']['Tables']['pt_packages']['Update']

export type CoachAvailability = Database['public']['Tables']['coach_availability']['Row']
export type CoachAvailabilityInsert = Database['public']['Tables']['coach_availability']['Insert']
export type CoachAvailabilityUpdate = Database['public']['Tables']['coach_availability']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export type NotificationLog = Database['public']['Tables']['notifications_log']['Row']
export type NotificationLogInsert = Database['public']['Tables']['notifications_log']['Insert']
export type NotificationLogUpdate = Database['public']['Tables']['notifications_log']['Update']

export type GymInfo = Database['public']['Tables']['gym_info']['Row']
export type GymInfoInsert = Database['public']['Tables']['gym_info']['Insert']
export type GymInfoUpdate = Database['public']['Tables']['gym_info']['Update']

export type Pricing = Database['public']['Tables']['pricing']['Row']
export type PricingInsert = Database['public']['Tables']['pricing']['Insert']
export type PricingUpdate = Database['public']['Tables']['pricing']['Update']

export type GymSettings = Database['public']['Tables']['gym_settings']['Row']
export type GymSettingsInsert = Database['public']['Tables']['gym_settings']['Insert']
export type GymSettingsUpdate = Database['public']['Tables']['gym_settings']['Update']

export type GymWorkingHours = Database['public']['Tables']['gym_working_hours']['Row']
export type GymWorkingHoursInsert = Database['public']['Tables']['gym_working_hours']['Insert']
export type GymWorkingHoursUpdate = Database['public']['Tables']['gym_working_hours']['Update']

// Extended types with relations
export type MemberWithCoach = Member & {
  coach: Coach | null
}

export type MemberWithSubscriptions = Member & {
  gym_memberships: GymMembership[]
  pt_packages: (PTPackage & { coach: Coach })[]
}

export type BookingWithDetails = Booking & {
  member: Member
  coach: Coach
  pt_package: PTPackage | null
}
