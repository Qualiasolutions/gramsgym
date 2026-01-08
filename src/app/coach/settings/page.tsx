import { createClient } from '@/lib/supabase/server'
import { SettingsManager } from '@/components/coach/settings-manager'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Get gym settings
  const { data: gymSettings } = await supabase
    .from('gym_settings')
    .select('*')
    .single()

  // Get pricing
  const { data: pricing } = await supabase
    .from('pricing')
    .select('*')
    .order('type', { ascending: true })
    .order('price', { ascending: true })

  // Get working hours
  const { data: workingHours } = await supabase
    .from('gym_working_hours')
    .select('*')
    .order('day_of_week', { ascending: true })

  return (
    <SettingsManager
      gymSettings={gymSettings}
      pricing={pricing || []}
      workingHours={workingHours || []}
    />
  )
}
