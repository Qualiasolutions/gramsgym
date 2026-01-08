import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type') // 'member' or 'coach'
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if user is a coach or member and redirect accordingly
        if (type === 'member') {
          const { data: member } = await supabase
            .from('members')
            .select('id')
            .eq('id', user.id)
            .single()

          if (member) {
            return NextResponse.redirect(`${origin}/member/dashboard`)
          }
        } else if (type === 'coach') {
          const { data: coach } = await supabase
            .from('coaches')
            .select('id')
            .eq('id', user.id)
            .single()

          if (coach) {
            return NextResponse.redirect(`${origin}/coach/dashboard`)
          }
        }

        // If no specific type, try to determine by checking both tables
        const { data: coach } = await supabase
          .from('coaches')
          .select('id')
          .eq('id', user.id)
          .single()

        if (coach) {
          return NextResponse.redirect(`${origin}/coach/dashboard`)
        }

        const { data: member } = await supabase
          .from('members')
          .select('id')
          .eq('id', user.id)
          .single()

        if (member) {
          return NextResponse.redirect(`${origin}/member/dashboard`)
        }
      }

      // If user doesn't exist in either table, redirect to home
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
