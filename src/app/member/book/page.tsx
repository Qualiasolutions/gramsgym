import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/member/booking-form'
import { UserX, Package } from 'lucide-react'
import { addWeeks } from 'date-fns'
import { isDemoMode } from '@/lib/demo-mode'
import { demoMember, demoCoach, demoPTPackage, demoAvailability, demoBookings } from '@/lib/demo-data'

export default async function BookSessionPage() {
  const demoMode = await isDemoMode()
  if (demoMode === 'member') {
    const memberWithCoach = { ...demoMember, coach: demoCoach }
    return (
      <div className="pb-20 lg:pb-6">
        <BookingForm
          member={memberWithCoach}
          coach={demoCoach}
          ptPackages={[demoPTPackage]}
          coachAvailability={demoAvailability}
          existingBookings={demoBookings.filter(b => b.status === 'scheduled')}
        />
      </div>
    )
  }

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const { data: { user } } = await supabase.auth.getUser()

  const { data: member } = await client
    .from('members')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar, profile_photo_url, specialty_en)
    `)
    .eq('id', user?.id)
    .single()

  const { data: ptPackages } = await client
    .from('pt_packages')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar)
    `)
    .eq('member_id', user?.id)
    .eq('status', 'active')
    .gt('remaining_sessions', 0)

  const { data: coachAvailability } = await client
    .from('coach_availability')
    .select('*')
    .eq('coach_id', member?.assigned_coach_id)
    .eq('is_available', true)

  const today = new Date()
  const twoWeeksLater = addWeeks(today, 2)

  const { data: existingBookings } = await client
    .from('bookings')
    .select('scheduled_at, duration_minutes, coach_id')
    .eq('coach_id', member?.assigned_coach_id)
    .eq('status', 'scheduled')
    .gte('scheduled_at', today.toISOString())
    .lte('scheduled_at', twoWeeksLater.toISOString())

  const canBook = ptPackages && ptPackages.length > 0 && member?.coach

  return (
    <div className="pb-20 lg:pb-6">
      {!member?.coach ? (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
              <UserX className="h-10 w-10 text-amber-400" />
            </div>
            <h3 className="font-display text-xl font-medium text-foreground/90 mb-2">No Coach Assigned</h3>
            <p className="text-noir-400 text-sm max-w-md mx-auto">
              You don&apos;t have an assigned coach yet. Please contact the gym to get a coach assigned to your account.
            </p>
          </div>
        </div>
      ) : !canBook ? (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
              <Package className="h-10 w-10 text-amber-400" />
            </div>
            <h3 className="font-display text-xl font-medium text-foreground/90 mb-2">No Active PT Package</h3>
            <p className="text-noir-400 text-sm max-w-md mx-auto">
              You need an active PT package with remaining sessions to book. Please contact your coach to purchase a package.
            </p>
          </div>
        </div>
      ) : (
        <BookingForm
          member={member}
          coach={member.coach}
          ptPackages={ptPackages}
          coachAvailability={coachAvailability || []}
          existingBookings={existingBookings || []}
        />
      )}
    </div>
  )
}
