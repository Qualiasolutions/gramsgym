import { BookingsCalendar } from '@/components/coach/bookings-calendar'
import { startOfWeek, endOfWeek } from 'date-fns'
import { isDemoMode } from '@/lib/demo-mode'
import { demoBookings, demoCoach, demoMembers } from '@/lib/demo-data'
import { getCachedBookingsForRange, getCachedCoaches, getCachedMembers } from '@/lib/cache'

export default async function BookingsPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()
  if (demoMode === 'coach') {
    return (
      <BookingsCalendar
        bookings={demoBookings}
        coaches={[demoCoach]}
        members={demoMembers}
      />
    )
  }

  // Get bookings for current week
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 6 }) // Saturday
  const weekEnd = endOfWeek(today, { weekStartsOn: 6 })

  // Use cached queries for better performance (parallel fetch)
  const [bookings, coachesData, membersData] = await Promise.all([
    getCachedBookingsForRange(weekStart.toISOString(), weekEnd.toISOString()),
    getCachedCoaches(),
    getCachedMembers(),
  ])

  // Extract just the fields needed for the calendar from members
  // Type assertion needed due to unstable_cache losing return types
  const members = (membersData as Array<{ id: string; name_en: string; name_ar: string }> | null)?.map(m => ({
    id: m.id,
    name_en: m.name_en,
    name_ar: m.name_ar,
  })) || []

  const coaches = (coachesData as Array<{ id: string; name_en: string; name_ar: string }> | null)?.map(c => ({
    id: c.id,
    name_en: c.name_en,
    name_ar: c.name_ar,
  })) || []

  return (
    <BookingsCalendar
      bookings={bookings || []}
      coaches={coaches || []}
      members={members || []}
    />
  )
}
