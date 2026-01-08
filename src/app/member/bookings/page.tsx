import { createClient } from '@/lib/supabase/server'
import { MemberBookingsList } from '@/components/member/bookings-list'

interface PageProps {
  searchParams: Promise<{ success?: string }>
}

export default async function MemberBookingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const { data: { user } } = await supabase.auth.getUser()

  // Get all bookings for this member
  const { data: bookings } = await client
    .from('bookings')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar, profile_photo_url)
    `)
    .eq('member_id', user?.id)
    .order('scheduled_at', { ascending: false })

  return (
    <MemberBookingsList
      memberId={user?.id || ''}
      bookings={bookings || []}
      showSuccess={params.success === 'true'}
    />
  )
}
